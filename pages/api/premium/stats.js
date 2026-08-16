/**
 * GET /api/premium/stats
 * 
 * Returns:
 *   - activeCount: number of users with status='active'
 *   - totalApproved: lifetime approved users
 *   - reviews: approved public reviews (most recent first)
 * 
 * Public route — no auth required.
 */

import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const [activeCount, totalApproved, reviews] = await Promise.all([
            prisma.premiumRequest.count({ where: { status: 'active' } }),
            prisma.premiumRequest.count({ where: { status: { in: ['active', 'approved', 'expired'] } } }),
            prisma.premiumReview.findMany({
                where: { approved: true, type: 'review' },
                orderBy: { createdAt: 'desc' },
                take: 20,
                select: {
                    id: true,
                    rating: true,
                    displayName: true,
                    text: true,
                    createdAt: true,
                },
            }).catch(() => []),
        ]);

        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
        return res.status(200).json({
            success: true,
            activeCount,
            totalApproved,
            reviews,
        });
    } catch (err) {
        console.error('[Stats API]', err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
}
