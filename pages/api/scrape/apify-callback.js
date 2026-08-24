/**
 * POST /api/scrape/apify-callback
 *
 * Apify webhook endpoint — called automatically by Apify when an actor run
 * succeeds. Processes the dataset and saves new Canva links to the database.
 *
 * Security: validated via ?secret= query param (must match ADMIN_SECRET env var).
 *
 * Apify webhook POST body shape (relevant fields):
 *   {
 *     eventType: 'ACTOR.RUN.SUCCEEDED',
 *     resource: { id: '<runId>', defaultDatasetId: '<datasetId>', ... }
 *   }
 */

import { fetchDatasetFromApifyRun } from '../../../lib/sources/scraper';
import prisma from '../../../lib/prisma';

// Keep in sync with sources/index.js
const LINK_EXPIRY_DAYS = 7;
const MAX_CACHED_LINKS = 30;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // ── Auth: secret must match ADMIN_SECRET ──────────────────────────
    const providedSecret = req.query.secret || '';
    const expectedSecret = process.env.ADMIN_SECRET || '';
    if (!expectedSecret || providedSecret !== expectedSecret) {
        console.warn('[ApifyCallback] Unauthorized webhook call — rejecting.');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // ── Parse Apify webhook payload ───────────────────────────────────
    const { eventType, resource } = req.body || {};

    if (eventType !== 'ACTOR.RUN.SUCCEEDED' || !resource?.defaultDatasetId) {
        console.log('[ApifyCallback] Unexpected event or missing datasetId:', eventType);
        return res.status(200).json({ ok: true, skipped: true });
    }

    const datasetId = resource.defaultDatasetId;
    console.log(`[ApifyCallback] Run succeeded. datasetId: ${datasetId}`);

    // Respond immediately — Apify retries if we take too long
    res.status(200).json({ ok: true, datasetId });

    // ── Process dataset asynchronously (non-blocking after response sent) ──
    try {
        const links = await fetchDatasetFromApifyRun(datasetId);

        if (links.length === 0) {
            console.log('[ApifyCallback] No Canva links extracted from dataset.');
            return;
        }

        // Load existing URLs to count truly new inserts
        const existingUrls = new Set(
            (await prisma.canvaLink.findMany({ select: { url: true } }).catch(() => []))
                .map(l => l.url.toLowerCase().trim())
        );

        const newLinks = links.filter(l => !existingUrls.has(l.url?.toLowerCase().trim()));
        console.log(`[ApifyCallback] ${newLinks.length} new / ${links.length - newLinks.length} dupes`);

        // Save to DB
        for (const link of links) {
            try {
                await prisma.canvaLink.upsert({
                    where: { url: link.url },
                    create: {
                        url: link.url,
                        source: link.source || 'scraper',
                        sourceRef: link.sourceRef || null,
                        authorName: link.authorName || null,
                        status: 'unverified',
                        createdAt: link.createdAt ? new Date(link.createdAt) : new Date(),
                        fetchedAt: new Date(),
                    },
                    update: { fetchedAt: new Date() },
                });
            } catch { /* skip duplicate constraint errors */ }
        }

        // Cleanup: expire old links and trim to MAX_CACHED_LINKS
        if (newLinks.length > 0) {
            const expiryDate = new Date(Date.now() - LINK_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
            await prisma.canvaLink.updateMany({
                where: { createdAt: { lt: expiryDate }, status: { not: 'expired' } },
                data: { status: 'expired' },
            }).catch(() => { });

            const activeLinks = await prisma.canvaLink.findMany({
                where: { status: { not: 'expired' } },
                orderBy: { createdAt: 'desc' },
                select: { id: true },
            }).catch(() => []);

            if (activeLinks.length > MAX_CACHED_LINKS) {
                const idsToExpire = activeLinks.slice(MAX_CACHED_LINKS).map(l => l.id);
                await prisma.canvaLink.updateMany({
                    where: { id: { in: idsToExpire } },
                    data: { status: 'expired' },
                }).catch(() => { });
            }

            console.log(`[ApifyCallback] Saved ${newLinks.length} new links. DB updated.`);
        }
    } catch (err) {
        console.error('[ApifyCallback] Error processing dataset:', err.message);
    }
}
