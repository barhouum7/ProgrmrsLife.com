/**
 * POST /api/scrape/apify-callback
 *
 * Apify webhook — called when an actor run succeeds.
 * Fetches the dataset, saves new Canva links to DB, and responds 200.
 *
 * All DB work is done BEFORE responding so Vercel doesn't kill the function
 * mid-flight (background-after-response is unreliable on serverless).
 *
 * Auth: ?secret= must match APIFY_WEBHOOK_SECRET env var.
 *       If the env var is not set, the secret is skipped (open endpoint)
 *       so the webhook works even without configuring an extra secret.
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

    // ── Auth: secret must match APIFY_WEBHOOK_SECRET env var. ──────────────────────────────────────────────────────────
    // Secret confirmed configured so Enforce it
    const expectedSecret = process.env.APIFY_WEBHOOK_SECRET || '';
    const providedSecret = req.query.secret || '';
    if (!expectedSecret || providedSecret !== expectedSecret) {
        console.warn('[ApifyCallback] Unauthorized webhook call — rejecting.');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // ── Parse Apify payload ───────────────────────────────────────────
    // Apify can nest the run details under `eventData` or `resource`
    const body = req.body || {};
    const eventType = body.eventType;
    const datasetId =
        body.resource?.defaultDatasetId ||
        body.eventData?.defaultDatasetId ||
        body.defaultDatasetId;

    console.log(`[ApifyCallback] Received: eventType=${eventType} datasetId=${datasetId}`);

    if (eventType !== 'ACTOR.RUN.SUCCEEDED' || !datasetId) {
        console.log('[ApifyCallback] Unexpected payload — skipping.', JSON.stringify(body).slice(0, 200));
        return res.status(200).json({ ok: true, skipped: true });
    }

    // ── Fetch & save — synchronously before responding ──────────────
    // Vercel may kill the function immediately after res.end(), so we
    // do all the work first, then respond.
    try {
        const links = await fetchDatasetFromApifyRun(datasetId);

        if (links.length === 0) {
            console.log('[ApifyCallback] No Canva links extracted.');
            return res.status(200).json({ ok: true, new: 0 });
        }

        // Load existing URLs to count truly new inserts
        const existingUrls = new Set(
            (await prisma.canvaLink.findMany({ select: { url: true } }).catch(() => []))
                .map(l => l.url.toLowerCase().trim())
        );

        let newCount = 0;
        for (const link of links) {
            const norm = link.url?.toLowerCase().trim();
            if (!norm) continue;
            const isNew = !existingUrls.has(norm);
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
                if (isNew) newCount++;
            } catch { /* skip constraint errors */ }
        }

        console.log(`[ApifyCallback] ${newCount} new / ${links.length - newCount} dupes saved.`);

        // Cleanup if we added anything
        if (newCount > 0) {
            const expiryDate = new Date(Date.now() - LINK_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
            await prisma.canvaLink.updateMany({
                where: { createdAt: { lt: expiryDate }, status: { not: 'expired' } },
                data: { status: 'expired' },
            }).catch(() => { });

            const active = await prisma.canvaLink.findMany({
                where: { status: { not: 'expired' } },
                orderBy: { createdAt: 'desc' },
                select: { id: true },
            }).catch(() => []);

            if (active.length > MAX_CACHED_LINKS) {
                const idsToExpire = active.slice(MAX_CACHED_LINKS).map(l => l.id);
                await prisma.canvaLink.updateMany({
                    where: { id: { in: idsToExpire } },
                    data: { status: 'expired' },
                }).catch(() => { });
            }
        }

        return res.status(200).json({ ok: true, new: newCount, total: links.length });

    } catch (err) {
        console.error('[ApifyCallback] Error:', err.message);
        return res.status(500).json({ error: err.message });
    }
}
