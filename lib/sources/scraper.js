/**
 * Web Scraper Source — Cascades through scraping services
 * 
 * Services (in priority order):
 * 1. Apify — Twitter search Actor via official apify-client npm package
 * 2. Sorsa API — Direct X/Twitter search (POST v3, ApiKey header)
 * 
 * Key insight: Twitter/X shortens ALL URLs to t.co/... in tweet text.
 * Real Canva URLs live in entities.urls[].expanded_url — we must check
 * BOTH the tweet text AND all entity URLs to find invite links.
 * 
 * Each returns normalized CanvaLink-compatible objects.
 */

import axios from 'axios';
import { ApifyClient } from 'apify-client';

// ─── URL EXTRACTION ─────────────────────────────────────────────────
// Match canva.com/brand/join invite links (with token and referrer params)
const CANVA_LINK_PATTERN = /canva\.com\/brand\/join\?[^\s"'<>]+token=[^\s"'<>]+referrer=team-invite/gi;
const CANVA_URL_VALIDATOR = /^https?:\/\/(www\.)?canva\.com\/brand\/join\?.*token=.+&.*referrer=team-invite/i;
// Broader pattern: any canva.com/brand/join URL (may not have all query params visible)
const CANVA_BROAD_PATTERN = /https?:\/\/(www\.)?canva\.com\/brand\/join\?[^\s"'<>]+/gi;

/**
 * Extract Canva invite URLs from text content
 * Uses both strict and broad patterns to maximize link capture
 */
function extractCanvaLinks(text) {
    if (!text) return [];
    // Try strict pattern first
    const strict = text.match(CANVA_LINK_PATTERN) || [];
    // Fall back to broader pattern
    const broad = text.match(CANVA_BROAD_PATTERN) || [];
    const all = [...new Set([...strict, ...broad])];
    return all.length > 0 ? all : [];
}

/**
 * Extract ALL URLs from text (including t.co shortened ones)
 */
function extractAllUrls(text) {
    if (!text) return [];
    const urlPattern = /https?:\/\/[^\s"'<>]+/gi;
    return text.match(urlPattern) || [];
}

/**
 * Deep-search an object for Canva URLs in any string field
 */
function deepExtractCanvaUrls(obj, depth = 0) {
    if (depth > 5 || !obj) return [];
    const urls = [];

    if (typeof obj === 'string') {
        urls.push(...extractCanvaLinks(obj));
    } else if (Array.isArray(obj)) {
        for (const item of obj) {
            urls.push(...deepExtractCanvaUrls(item, depth + 1));
        }
    } else if (typeof obj === 'object') {
        for (const [key, value] of Object.entries(obj)) {
            // Prioritize URL-related fields
            if (['url', 'expanded_url', 'display_url', 'unwound_url', 'full_text', 'text'].includes(key)) {
                if (typeof value === 'string') {
                    urls.push(...extractCanvaLinks(value));
                }
            }
            urls.push(...deepExtractCanvaUrls(value, depth + 1));
        }
    }

    return [...new Set(urls)];
}


// ─── APIFY ──────────────────────────────────────────────────────────

/**
 * Actor fallback list — tried in order until one succeeds.
 * These are pay-per-result actors that work on Apify's free tier ($5/mo credit).
 * 
 * 1. apidojo/tweet-scraper — (~$0.40/1K tweets) - (not working, need paid plan)
 * 2. igolaizola/x-twitter-scraper-ppe
    * Cost: ~$0.15 per 1,000 tweets.
    * Why it works: Built specifically with an Event-Based/Pay-Per-Result model. It does not force a paid platform subscription, meaning your initial $5 monthly credit goes a long way.
    * Capabilities: Supports advanced filters like date ranges, media types, geolocations, and safe-search filters.
 * 3. kaitoeasyapi/twitter-x-data-tweet-scraper-pay-per-result-cheapest
    * Cost: ~$0.18 - $0.25 per 1,000 tweets.
    * Why it works: Optimized for low-cost, high-speed, direct API ingestion without forcing monthly retainer subscriptions.
 * 4. microworlds/twitter-scraper — Alternative scraper (not working 404 error not found)
 * 5. apidojo/twitter-scraper-lite — Needs paid plan (last resort later if needed)
 */
const APIFY_ACTOR_FALLBACKS = [
    'kaitoeasyapi/twitter-x-data-tweet-scraper-pay-per-result-cheapest',
    'igolaizola/x-twitter-scraper-ppe',
    // 'apidojo/tweet-scraper',
    // 'apidojo/twitter-scraper-lite',
];

/**
 * Fetch Canva links using the official apify-client npm package.
 * 
 * Pattern: Initialize client → call actor → fetch dataset items
 * Docs: https://docs.apify.com/api/client/js
 * 
 * Requires env: APIFY_API_TOKEN, APIFY_ACTOR_ID (optional)
 * Tries multiple actors in sequence until one returns results.
 */
/**
 * Start an Apify actor run and register a webhook callback — returns immediately.
 *
 * The actor runs asynchronously on Apify’s platform. When it finishes, Apify
 * POSTs to our /api/scrape/apify-callback endpoint which processes the dataset.
 *
 * This is the production path (Vercel 10s function limit makes waitSecs:90 impossible).
 * In local dev the same flow works end-to-end since the dev server has no timeout.
 *
 * Returns true if the run was started, false on error.
 */
export async function fetchFromApify(callbackBaseUrl) {
    const token = process.env.APIFY_API_TOKEN;
    if (!token) {
        console.log('[Apify] No API token configured, skipping.');
        return false;
    }

    const client = new ApifyClient({ token });

    // Use env actor ID or fallback list
    const actorIds = process.env.APIFY_ACTOR_ID
        ? [process.env.APIFY_ACTOR_ID]
        : APIFY_ACTOR_FALLBACKS;

    // Multi-pass search queries — tried in order until new links found.
    // Each pass widens the window or changes the query term.
    function buildQueryPasses() {
        const now = new Date();
        const fmt = (d) => d.toISOString().slice(0, 10);
        const since24h = fmt(new Date(now - 24 * 60 * 60 * 1000));
        const since48h = fmt(new Date(now - 48 * 60 * 60 * 1000));
        const since7d = fmt(new Date(now - 7 * 24 * 60 * 60 * 1000));
        return [
            // Pass 1: strictest — recent 24h, exact phrase
            { label: '24h-exact', query: `"canva.com/brand/join" since:${since24h} -is:retweet`, since: since24h },
            // Pass 2: 48h window, exact phrase
            { label: '48h-exact', query: `"canva.com/brand/join" since:${since48h} -is:retweet`, since: since48h },
            // Pass 3: 7-day window, no -is:retweet filter (retweets can still carry fresh URLs)
            { label: '7d-broad', query: `"canva.com/brand/join" since:${since7d}`, since: since7d },
            // Pass 4: alternate terms people use for Canva team invites
            { label: '7d-alt', query: `canva brand join team invite since:${since7d}`, since: since7d },
        ];
    }

    // Use the first pass as the query for this run (background runs are cheap, so
    // we use a focused 24h query; the callback will decide if results are fresh)
    const pass = buildQueryPasses()[0];
    console.log(`[Apify] Starting async actor run | Pass: ${pass.label} | Query: ${pass.query}`);

    for (const actorId of actorIds) {
        try {
            const actorClient = client.actor(actorId);

            const input = {
                searchTerms: ['"canva.com/brand/join"'],
                searchQueries: [pass.query],
                queries: [pass.query],
                startUrls: [
                    { url: `https://x.com/search?q=${encodeURIComponent(pass.query)}&f=live` },
                ],
                maxTweets: 50,
                maxItems: 50,
                sort: 'Latest',
            };

            // Build webhook options if a callback URL was provided
            const webhookUrl = callbackBaseUrl
                ? `${callbackBaseUrl}/api/scrape/apify-callback?secret=${encodeURIComponent(process.env.ADMIN_SECRET || '')}`
                : null;

            const runOptions = {
                waitSecs: 0,  // Return immediately — don’t block the Vercel function
                ...(webhookUrl ? {
                    webhooks: [{
                        eventTypes: ['ACTOR.RUN.SUCCEEDED'],
                        requestUrl: webhookUrl,
                    }],
                } : {}),
            };

            const run = await actorClient.call(input, runOptions);
            console.log(`[Apify] Actor ${actorId} started async, runId: ${run.id}`);
            return true; // Signal that a scrape is in progress

        } catch (error) {
            const msg = error.message || String(error);
            console.error(`[Apify] Actor ${actorId} failed to start: ${msg}`);
            // Try next actor
        }
    }

    console.log('[Apify] All actors failed to start.');
    return false;
}


/**
 * Fetch and parse Canva links from a completed Apify run’s dataset.
 * Called by the /api/scrape/apify-callback endpoint after a webhook fires.
 */
export async function fetchDatasetFromApifyRun(datasetId) {
    const token = process.env.APIFY_API_TOKEN;
    if (!token) return [];

    try {
        const client = new ApifyClient({ token });
        const datasetClient = client.dataset(datasetId);
        const { items } = await datasetClient.listItems();
        console.log(`[Apify] Fetching dataset ${datasetId}: ${items.length} items.`);
        if (items.length === 0) return [];
        const links = extractLinksFromTweets(items, 'apify');
        console.log(`[Apify] Extracted ${links.length} Canva links from dataset.`);
        return links;
    } catch (err) {
        console.error(`[Apify] fetchDatasetFromApifyRun error: ${err.message}`);
        return [];
    }
}


// ─── SORSA API ──────────────────────────────────────────────────────

/**
 * Fetch Canva links using Sorsa API v3.
 * 
 * Sorsa v3 uses:
 * - Method: POST
 * - Auth header: ApiKey (case-sensitive, NOT Authorization: Bearer)
 * - Body: { query, order }
 * 
 * Docs: https://docs.sorsa.io/search-tweets
 * Requires env: SORSA_API_KEY
 */
export async function fetchFromSorsa() {
    const apiKey = process.env.SORSA_API_KEY;
    if (!apiKey) {
        console.log('[Sorsa] No API key configured, skipping.');
        return [];
    }

    try {
        console.log('[Sorsa] Starting tweet search...');

        // Sorsa API v3 — POST with ApiKey header (case-sensitive!)
        const since48h = new Date(Date.now() - 48 * 60 * 60 * 1000);
        const since48hDate = since48h.toISOString().slice(0, 10); // YYYY-MM-DD for since: operator
        const response = await axios.post(
            'https://api.sorsa.io/v3/search-tweets',
            {
                query: `"canva.com/brand/join" since:${since48hDate} -is:retweet`,
                order: 'latest',
                start_time: since48h.toISOString(), // RFC3339, for APIs supporting it
            },
            {
                headers: {
                    'ApiKey': apiKey,
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            }
        );

        const tweets = response.data?.tweets || [];
        console.log(`[Sorsa] Found ${tweets.length} raw tweets.`);

        if (tweets.length === 0) return [];

        // Extract Canva links from tweets
        const links = extractLinksFromTweets(tweets, 'sorsa');

        console.log(`[Sorsa] Extracted ${links.length} Canva links from ${tweets.length} tweets.`);

        // Debug: log sample if extraction fails
        if (tweets.length > 0 && links.length === 0) {
            const sample = tweets[0];
            console.log(`[Sorsa] Sample tweet: "${(sample.full_text || sample.text || '').substring(0, 200)}"`);
            console.log(`[Sorsa] Sample entities:`, JSON.stringify(sample.entities || []).substring(0, 300));
        }

        return links;

    } catch (error) {
        const status = error.response?.status;
        const msg = error.response?.data?.message || error.response?.data?.error || error.message;
        console.error(`[Sorsa] Error: ${status || 'network'} — ${msg}`);

        if (status === 403) {
            console.log('[Sorsa] API key quota exhausted or expired. Check https://api.sorsa.io/playground');
        }

        return [];
    }
}


// ─── SHARED TWEET → LINK EXTRACTION ────────────────────────────────

/**
 * Extract Canva invite links from tweet objects (works with both Apify and Sorsa).
 * 
 * Twitter shortens ALL URLs to t.co/... in tweet text.
 * Real URLs are in entities.urls[].expanded_url or entities[].expanded_url
 * 
 * This function checks:
 * 1. Tweet full_text/text for inline Canva URLs
 * 2. entities.urls[].expanded_url (Twitter v1 format)
 * 3. entities[].expanded_url (Sorsa flat entities format)
 * 4. Deep search all string fields as last resort
 */
function extractLinksFromTweets(tweets, source = 'scraper') {
    const results = [];
    // Skip tweets older than 7 days — team slots fill fast, old links rarely work
    const MAX_TWEET_AGE_MS = 7 * 24 * 60 * 60 * 1000;
    const cutoff = Date.now() - MAX_TWEET_AGE_MS;

    for (const tweet of tweets) {
        // Recency gate: skip old tweets
        const tweetDate = tweet.created_at ? new Date(tweet.created_at).getTime() : Date.now();
        if (tweetDate < cutoff) {
            console.log(`[Scraper] Skipping old tweet from ${new Date(tweetDate).toISOString().slice(0, 10)}`);
            continue;
        }

        const text = tweet.full_text || tweet.text || '';
        const tweetUrl = tweet.url
            || `https://x.com/${tweet.user?.username || tweet.user?.screen_name || tweet.author?.username || 'unknown'}/status/${tweet.id_str || tweet.id}`;
        const authorName = tweet.user?.display_name || tweet.user?.name || tweet.user?.screen_name
            || tweet.author?.name || tweet.author?.display_name || 'Unknown';

        // Collect all candidate URLs from every possible location
        const candidateUrls = new Set();

        // 1. From tweet text directly
        extractCanvaLinks(text).forEach(u => candidateUrls.add(u));

        // 2. From entities.urls (Twitter API v1 format — Apify uses this)
        if (tweet.entities?.urls && Array.isArray(tweet.entities.urls)) {
            for (const entity of tweet.entities.urls) {
                const expanded = entity.expanded_url || entity.url || '';
                if (expanded.includes('canva.com')) {
                    extractCanvaLinks(expanded).forEach(u => candidateUrls.add(u));
                    // If expanded URL is a canva link even without strict match
                    if (expanded.includes('canva.com/brand/join')) {
                        candidateUrls.add(expanded);
                    }
                }
            }
        }

        // 3. From entities[] (Sorsa flat entities format)
        if (Array.isArray(tweet.entities)) {
            for (const entity of tweet.entities) {
                const expanded = entity.expanded_url || entity.url || '';
                if (expanded.includes('canva.com')) {
                    extractCanvaLinks(expanded).forEach(u => candidateUrls.add(u));
                    if (expanded.includes('canva.com/brand/join')) {
                        candidateUrls.add(expanded);
                    }
                }
            }
        }

        // 4. Deep search the entire tweet object as last resort
        if (candidateUrls.size === 0) {
            deepExtractCanvaUrls(tweet).forEach(u => candidateUrls.add(u));
        }

        // Convert to link objects
        for (const url of candidateUrls) {
            // Clean up the URL (remove trailing junk characters)
            const cleanUrl = url.replace(/[)\]}>'"]+$/, '').trim();
            if (cleanUrl.includes('canva.com/brand/join')) {
                results.push({
                    url: cleanUrl,
                    source: 'scraper',
                    sourceRef: tweetUrl,
                    authorName,
                    createdAt: tweet.created_at ? new Date(tweet.created_at) : new Date(),
                });
            }
        }
    }

    // Deduplicate by URL
    const seen = new Set();
    return results.filter(link => {
        const normalized = link.url.toLowerCase();
        if (seen.has(normalized)) return false;
        seen.add(normalized);
        return true;
    });
}


// ─── VALIDATION HELPERS ─────────────────────────────────────────────

/**
 * Validate a single Canva invite URL format
 */
export function isValidCanvaLink(url) {
    return CANVA_URL_VALIDATOR.test(url);
}
