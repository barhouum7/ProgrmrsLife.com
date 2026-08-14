/**
 * GET  /api/links/admin — List community links pending review
 * POST /api/links/admin — Verify or reject a community link
 *
 * Protected by ADMIN_SECRET env variable.
 */

import prisma from '../../../lib/prisma';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

function verifyAdmin(req) {
    const key = req.query.key || req.body?.key || req.headers['x-admin-key'];
    return !!ADMIN_SECRET && key === ADMIN_SECRET;
}

export default async function handler(req, res) {
    if (!verifyAdmin(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // ── GET: List pending community links ────────────────────────
    if (req.method === 'GET') {
        try {
            const statusFilter = req.query.status || 'unverified';
            const links = await prisma.canvaLink.findMany({
                where: {
                    source: 'community',
                    ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
                },
                orderBy: { createdAt: 'desc' },
                take: 50,
            });

            // Summary counts
            const counts = await prisma.canvaLink.groupBy({
                by: ['status'],
                where: { source: 'community' },
                _count: { status: true },
            });
            const summary = counts.reduce((acc, c) => {
                acc[c.status] = c._count.status;
                return acc;
            }, {});

            return res.status(200).json({ success: true, links, summary });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    }

    // ── POST: Verify or reject a community link ──────────────────
    if (req.method === 'POST') {
        try {
            const { linkId, action } = req.body;
            if (!linkId || !action) {
                return res.status(400).json({ success: false, error: 'linkId and action required' });
            }

            if (!['verify', 'reject', 'expire'].includes(action)) {
                return res.status(400).json({ success: false, error: 'action must be verify|reject|expire' });
            }

            // Rejected links: respond immediately then delete from DB after a short delay
            if (action === 'reject') {
                // Mark broken first so the response carries correct data
                const updated = await prisma.canvaLink.update({
                    where: { id: linkId },
                    data: { status: 'broken' },
                });
                // Non-blocking hard-delete after 5 seconds
                setTimeout(() => {
                    prisma.canvaLink.delete({ where: { id: linkId } })
                        .catch(e => console.warn('[Admin] Deferred link delete failed:', e.message));
                }, 5_000);
                return res.status(200).json({ success: true, link: updated, deleted: true });
            }

            const newStatus = action === 'verify' ? 'verified' : 'expired';
            const updated = await prisma.canvaLink.update({
                where: { id: linkId },
                data: { status: newStatus },
            });

            return res.status(200).json({ success: true, link: updated });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
}
