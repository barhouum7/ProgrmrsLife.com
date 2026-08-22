/**
 * Multi-Source Link Aggregator — Orchestrator
 * 
 * Smart scraping logic:
 * 1. Always serve from DB cache first
 * 2. Only trigger scrapers when cached links are mostly broken/downvoted
 * 3. Prevent concurrent/double scraper runs via in-memory lock
 * 4. Auto-cleanup old links (keep latest 30, expire links older than 7 days)
 * 5. Save all scraped results to DB for caching
 * 
 * Priority: DB Cache → Scrapers (Apify, Sorsa) → Community → X API (if enabled)
 */

import prisma from '../prisma';
import { fetchFromApify, fetchFromSorsa } from './scraper';
import { fetchCommunityLinks } from './community';
import { fetchFromXApi } from './xapi';

const CACHE_MAX_AGE_HOURS = 48; // Links considered fresh for 48h (was 24h — too aggressive)
const LINK_EXPIRY_DAYS = 7;     // Auto-expire links older than 7 days
const MAX_CACHED_LINKS = 30;    // Keep at most 30 links in DB
const BROKEN_THRESHOLD = 0.6;   // Trigger scrape if >60% of cached links are broken/downvoted

// ─── IN-MEMORY SCRAPER LOCK ────────────────────────────────────────
// Prevents concurrent scraper runs (no double requests)
let _scraping = false;
let _lastScrapeTime = 0;          // In-memory; reset on server restart
const MIN_SCRAPE_INTERVAL_MS = 4 * 60 * 60 * 1000; // 4 hours minimum between scrapes

// Persist last scrape time to/from DB so server restarts don't reset it
// Track whether the last completed scrape found any links
let _lastScrapeFoundLinks = true; // optimistic default

async function getLastScrapeTime() {
    if (_lastScrapeTime > 0) return _lastScrapeTime;
    try {
        const log = await prisma.apiCallLog.findFirst({ orderBy: { lastCallTime: 'desc' } });
        if (log) {
            _lastScrapeTime = new Date(log.lastCallTime).getTime();
            _lastScrapeFoundLinks = log.lastCallSuccess !== false; // treat unknown as true
        }
    } catch { /* ignore */ }
    return _lastScrapeTime;
}

async function setLastScrapeTime(time, foundLinks = true) {
    _lastScrapeTime = time;
    _lastScrapeFoundLinks = foundLinks;
    try {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        await prisma.apiCallLog.upsert({
            where: { date: today },
            update: { lastCallTime: new Date(time), callCount: { increment: 1 }, lastCallSuccess: foundLinks },
            create: { date: today, lastCallTime: new Date(time), callCount: 1, lastCallSuccess: foundLinks },
        });
    } catch { /* ignore */ }
}

/**
 * Main entry point — fetches links from all enabled sources with cascade logic
 */
export async function fetchCanvaLinks(forceFetch = false) {
    const results = {
        links: [],
        sources: [],
        cached: false,
        error: null,
        scraperStatus: null, // populated below
    };

    // Helper: build scraperStatus payload for the frontend
    async function buildScraperStatus() {
        const now = Date.now();
        const last = await getLastScrapeTime();
        const cooldown = _lastScrapeFoundLinks ? MIN_SCRAPE_INTERVAL_MS : 30 * 60 * 1000;
        const minsAgo = last > 0 ? Math.round((now - last) / 60000) : null;
        const minsLeft = last > 0 ? Math.max(0, Math.round((cooldown - (now - last)) / 60000)) : 0;
        return {
            lastScrapeMinutesAgo: minsAgo,
            cooldownMinsRemaining: minsLeft,
            lastScrapeFoundLinks: _lastScrapeFoundLinks,
            scraping: _scraping,
        };
    }

    try {
        // ── Step 1: Always get cached links from DB ──────────────────
        const cachedLinks = await getCachedLinks();

        if (cachedLinks.length > 0 && !forceFetch) {
            // Check if we should trigger a background scrape
            const shouldScrape = await shouldTriggerScrape(cachedLinks);

            results.links = cachedLinks;
            results.cached = true;
            results.sources.push({ name: 'cache', count: cachedLinks.length });
            results.scraperStatus = await buildScraperStatus();

            // Trigger background scrape if needed (non-blocking)
            if (shouldScrape) {
                results.scraperStatus.scraping = true; // Signal frontend to re-poll after delay
                runScrapersInBackground().catch(err => {
                    console.error('[Background Scrape] Error:', err.message);
                });
            }

            return results;
        }

        // ── Step 2: No cache or force — run scrapers synchronously ───
        const scrapedLinks = await runScrapers();

        if (scrapedLinks.length > 0) {
            results.sources.push(...scrapedLinks.map(s => ({ name: s.source, count: 1 })));
        }

        // ── Step 3: Always merge community-submitted links ───────────
        try {
            const communityLinks = await fetchCommunityLinks();
            if (communityLinks.length > 0) {
                scrapedLinks.push(...communityLinks);
                results.sources.push({ name: 'community', count: communityLinks.length });
            }
        } catch (err) {
            console.error('[Source: community] Error:', err.message);
        }

        // ── Step 4: Save community links only (runScrapers already saved scraper links) ──
        const communityOnlyLinks = deduplicateByUrl(scrapedLinks.filter(l => l.source === 'community'));
        if (communityOnlyLinks.length > 0) {
            await saveLinksToDb(communityOnlyLinks);
        }

        // ── Step 5: Run cleanup ──────────────────────────────────────
        await cleanupOldLinks();

        results.scraperStatus = await buildScraperStatus();

        // ── Step 6: Return fresh list from DB ────────────────────────
        const freshLinks = await prisma.canvaLink.findMany({
            where: { status: { not: 'expired' } },
            orderBy: { createdAt: 'desc' },
            take: MAX_CACHED_LINKS,
        });

        results.links = freshLinks;

        // Fallback if still empty
        if (results.links.length === 0) {
            results.links = await prisma.canvaLink.findMany({
                orderBy: { createdAt: 'desc' },
                take: 10,
            });
            if (results.links.length > 0) results.cached = true;
        }

    } catch (error) {
        console.error('[LinkAggregator] Fatal error:', error);
        results.error = { message: error.message || 'Failed to fetch links' };

        // Fall back to any cached data
        results.links = await prisma.canvaLink.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
        }).catch(() => []);
        results.cached = true;
    }

    return results;
}


// ─── SMART SCRAPE TRIGGER ──────────────────────────────────────────

/**
 * Determine if we should trigger a background scrape based on
 * link health (broken/downvoted ratio) and cache freshness.
 */
async function shouldTriggerScrape(cachedLinks) {
    // Guard: enforce minimum interval — but use a much shorter window if last scrape returned nothing
    const now = Date.now();
    const lastScrape = await getLastScrapeTime();
    const cooldown = _lastScrapeFoundLinks
        ? MIN_SCRAPE_INTERVAL_MS         // 4h after a successful scrape
        : 30 * 60 * 1000;               // 30 min after an empty scrape
    if (lastScrape > 0 && now - lastScrape < cooldown) {
        const mins = Math.round((now - lastScrape) / 60000);
        const waitMins = Math.round((cooldown - (now - lastScrape)) / 60000);
        console.log(`[Scraper] Skipping — last scrape was ${mins}min ago (wait ~${waitMins}min more)`);
        return false;
    }

    // No links at all — must scrape
    if (!cachedLinks || cachedLinks.length === 0) {
        console.log('[Scraper] No cached links — triggering scrape');
        return true;
    }

    // Only trigger based on link QUALITY (broken/downvoted ratio)
    // Time-based staleness alone is NOT enough to trigger a scrape
    try {
        const linkIds = cachedLinks.map(l => l.id);
        const votes = await prisma.vote.findMany({
            where: { linkId: { in: linkIds }, active: true },
            select: { linkId: true, type: true },
        });

        const downvoteCounts = {};
        const upvoteCounts = {};
        for (const vote of votes) {
            if (vote.type === 'down') downvoteCounts[vote.linkId] = (downvoteCounts[vote.linkId] || 0) + 1;
            else upvoteCounts[vote.linkId] = (upvoteCounts[vote.linkId] || 0) + 1;
        }

        let brokenCount = 0;
        for (const link of cachedLinks) {
            const downs = downvoteCounts[link.id] || 0;
            const ups = upvoteCounts[link.id] || 0;
            // Count if: explicitly marked broken/expired, or clearly downvoted (2+ downs, more than ups)
            if (link.status === 'broken' || link.status === 'expired' || (downs >= 2 && downs > ups)) {
                brokenCount++;
            }
        }

        const brokenRatio = brokenCount / cachedLinks.length;
        if (brokenRatio >= BROKEN_THRESHOLD) {
            console.log(`[Scraper] ${Math.round(brokenRatio * 100)}% of cached links broken/downvoted — triggering scrape`);
            return true;
        }

        console.log(`[Scraper] Links healthy (${Math.round(brokenRatio * 100)}% broken) — no scrape needed`);
        return false;
    } catch {
        return false;
    }
}


// ─── SCRAPER RUNNERS ───────────────────────────────────────────────

/**
 * Run scrapers in background (non-blocking, with lock)
 */
async function runScrapersInBackground() {
    const links = await runScrapers(); // runScrapers now stamps cooldown + saves to DB internally
    // links.length > 0 means raw scraper returned something;
    // foundNew is tracked inside runScrapers via setLastScrapeTime(_, foundNew)
    const foundNew = _lastScrapeFoundLinks;
    if (foundNew) {
        await cleanupOldLinks();
    } else {
        // Either 0 results or all duplicates — purge downvoted stale links
        console.log('[Scraper] No new links added — expiring heavily-downvoted scraper links.');
        await expireDownvotedScraperLinks();
    }
}

/**
 * Run scrapers with in-memory lock to prevent double requests
 */
async function runScrapers() {
    // Lock check — prevent concurrent runs
    if (_scraping) {
        console.log('[Scraper] Already running, skipping duplicate request.');
        return [];
    }

    const now = Date.now();
    const lastScrape = await getLastScrapeTime();
    if (now - lastScrape < MIN_SCRAPE_INTERVAL_MS) {
        console.log('[Scraper] Too soon since last scrape, skipping.');
        return [];
    }

    _scraping = true;
    // NOTE: we do NOT stamp _lastScrapeTime here — we stamp it AFTER results come back,
    // so an empty scrape doesn’t block re-tries for 4 hours.

    try {
        // Get enabled sources, ordered by priority
        const sourceConfigs = await prisma.sourceConfig.findMany({
            where: { enabled: true },
            orderBy: { priority: 'asc' },
        }).catch(() => []);

        // Default sources if DB has no config yet
        const enabledSources = sourceConfigs.length > 0
            ? sourceConfigs.map(s => s.sourceType)
            : ['scraper_apify', 'scraper_sorsa'];

        // Pre-load known URLs from DB so we can check for truly-new links per-provider
        const existingUrls = new Set(
            (await prisma.canvaLink.findMany({ select: { url: true } }).catch(() => []))
                .map(l => l.url.toLowerCase().trim())
        );

        const allLinks = [];
        let totalNew = 0; // track new links across all providers

        // Run scrapers SEQUENTIALLY (not in parallel) to avoid overloading
        for (const sourceType of enabledSources) {
            try {
                let sourceLinks = [];

                switch (sourceType) {
                    case 'scraper_apify':
                        sourceLinks = await fetchFromApify();
                        break;
                    case 'scraper_sorsa':
                        sourceLinks = await fetchFromSorsa();
                        break;
                    case 'x_api':
                        sourceLinks = await fetchFromXApi();
                        break;
                    default:
                        continue;
                }

                if (sourceLinks.length > 0) {
                    allLinks.push(...sourceLinks);

                    // Count truly new links from this provider (not already in DB or seen this run)
                    const providerNew = sourceLinks.filter(l => {
                        const norm = l.url?.toLowerCase().trim();
                        return norm && !existingUrls.has(norm);
                    });

                    // Add new URLs to the set so later providers don’t double-count them
                    providerNew.forEach(l => existingUrls.add(l.url.toLowerCase().trim()));
                    totalNew += providerNew.length;

                    // Update source config
                    await prisma.sourceConfig.update({
                        where: { sourceType },
                        data: { lastRunAt: new Date(), lastRunSuccess: providerNew.length > 0 },
                    }).catch(() => { });

                    if (providerNew.length > 0) {
                        console.log(`[Scraper] ${sourceType}: ${providerNew.length} new / ${sourceLinks.length - providerNew.length} dupes — stopping cascade.`);
                        break; // Got fresh links from this provider; save API quota
                    } else {
                        console.log(`[Scraper] ${sourceType}: all ${sourceLinks.length} links already in DB — trying next provider.`);
                    }
                } else {
                    console.log(`[Scraper] ${sourceType}: returned 0 links — trying next provider.`);
                    await prisma.sourceConfig.update({
                        where: { sourceType },
                        data: { lastRunAt: new Date(), lastRunSuccess: false },
                    }).catch(() => { });
                }
            } catch (err) {
                console.error(`[Source: ${sourceType}] Error:`, err.message);
                await prisma.sourceConfig.update({
                    where: { sourceType },
                    data: { lastRunAt: new Date(), lastRunSuccess: false },
                }).catch(() => { });
            }
        }

        // Stamp the cooldown AFTER results: treat all-dupe as empty
        const unique = deduplicateByUrl(allLinks);
        let newCount = 0;
        if (unique.length > 0) {
            newCount = await saveLinksToDb(unique);
        }
        const foundNew = newCount > 0;
        await setLastScrapeTime(Date.now(), foundNew);
        if (!foundNew && allLinks.length > 0) {
            console.log('[Scraper] All providers returned duplicates only — treating as empty scrape.');
        }
        return allLinks;
    } finally {
        _scraping = false;
    }
}


/**
 * Expire scraper links where >50% of their votes are downvotes (min 2 downvotes).
 * Called when a re-scrape returns zero results so stale links aren’t served forever.
 */
async function expireDownvotedScraperLinks() {
    try {
        // Fetch all active scraper links with their vote counts
        const links = await prisma.canvaLink.findMany({
            where: { source: 'scraper', status: { not: 'expired' } },
            select: { id: true },
        });
        if (links.length === 0) return;

        const linkIds = links.map(l => l.id);
        const votes = await prisma.vote.findMany({
            where: { linkId: { in: linkIds }, active: true },
            select: { linkId: true, type: true },
        });

        const downvotes = {};
        const upvotes = {};
        for (const v of votes) {
            if (v.type === 'down') downvotes[v.linkId] = (downvotes[v.linkId] || 0) + 1;
            else upvotes[v.linkId] = (upvotes[v.linkId] || 0) + 1;
        }

        const toExpire = links
            .filter(l => {
                const d = downvotes[l.id] || 0;
                const u = upvotes[l.id] || 0;
                return d >= 2 && d > u; // clearly net-negative
            })
            .map(l => l.id);

        if (toExpire.length > 0) {
            await prisma.canvaLink.updateMany({
                where: { id: { in: toExpire } },
                data: { status: 'expired' },
            });
            console.log(`[Scraper] Expired ${toExpire.length} downvoted link(s) from last batch.`);
        }
    } catch (err) {
        console.error('[Scraper] expireDownvotedScraperLinks error:', err.message);
    }
}


// ─── CACHE & CLEANUP ───────────────────────────────────────────────

/**
 * Get cached links that are still fresh
 */
async function getCachedLinks() {
    return prisma.canvaLink.findMany({
        where: {
            status: { not: 'expired' },
            // Hide community links that are unverified (pending review) or rejected by admin
            NOT: {
                AND: [
                    { source: 'community' },
                    { status: { in: ['unverified', 'broken'] } },
                ],
            },
        },
        orderBy: { createdAt: 'desc' },
        take: MAX_CACHED_LINKS,
    }).catch(() => []);
}


/**
 * Auto-cleanup old links:
 * 1. Expire links older than LINK_EXPIRY_DAYS
 * 2. Keep only MAX_CACHED_LINKS most recent
 */
async function cleanupOldLinks() {
    try {
        const expiryDate = new Date(Date.now() - LINK_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

        // Mark old links as expired
        await prisma.canvaLink.updateMany({
            where: {
                createdAt: { lt: expiryDate },
                status: { not: 'expired' },
            },
            data: { status: 'expired' },
        });

        // Delete expired links older than 30 days (with their votes via cascade)
        const deleteDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        await prisma.canvaLink.deleteMany({
            where: {
                status: 'expired',
                createdAt: { lt: deleteDate },
            },
        });

        // Keep only latest MAX_CACHED_LINKS active links
        const activeLinks = await prisma.canvaLink.findMany({
            where: { status: { not: 'expired' } },
            orderBy: { createdAt: 'desc' },
            select: { id: true },
        });

        if (activeLinks.length > MAX_CACHED_LINKS) {
            const idsToExpire = activeLinks.slice(MAX_CACHED_LINKS).map(l => l.id);
            await prisma.canvaLink.updateMany({
                where: { id: { in: idsToExpire } },
                data: { status: 'expired' },
            });
        }
    } catch (err) {
        console.error('[Cleanup] Error:', err.message);
    }
}


/**
 * Deduplicate links by URL
 */
function deduplicateByUrl(links) {
    const seen = new Set();
    return links.filter(link => {
        const normalized = link.url?.toLowerCase().trim();
        if (!normalized || seen.has(normalized)) return false;
        seen.add(normalized);
        return true;
    });
}


/**
 * Save links to database (upsert by URL).
 * Returns the count of truly NEW rows created (vs updates to existing rows).
 */
async function saveLinksToDb(links) {
    let newCount = 0;
    for (const link of links) {
        try {
            // Check if the URL already exists first (cheap SELECT)
            const existing = await prisma.canvaLink.findUnique({ where: { url: link.url }, select: { id: true } });
            await prisma.canvaLink.upsert({
                where: { url: link.url },
                create: {
                    url: link.url,
                    source: link.source,
                    sourceRef: link.sourceRef || null,
                    authorName: link.authorName || null,
                    status: 'unverified',
                    createdAt: link.createdAt ? new Date(link.createdAt) : new Date(),
                    fetchedAt: new Date(),
                },
                update: {
                    fetchedAt: new Date(),
                    // Don't overwrite user-set status (e.g., if community voted it "working")
                },
            });
            if (!existing) newCount++; // row didn't exist before — truly new
        } catch (err) {
            // Skip duplicate or constraint errors silently
        }
    }
    console.log(`[Scraper] saveLinksToDb: ${newCount} new / ${links.length - newCount} updated`);
    return newCount;
}
