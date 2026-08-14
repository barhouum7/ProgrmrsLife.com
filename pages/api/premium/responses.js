/**
 * GET /api/premium/responses — Fetch survey & quiz responses for admin
 * Protected by ADMIN_SECRET env var.
 *
 * Query params:
 *   ?key=SECRET
 *   ?type=survey|quiz|all  (default: all)
 *   ?limit=50
 */

import prisma from '../../../lib/prisma';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

function verifyAdmin(req) {
    const key = req.query.key || req.headers['x-admin-key'];
    return !!ADMIN_SECRET && key === ADMIN_SECRET;
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    if (!verifyAdmin(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
        const type = req.query.type || 'all';
        const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);

        const [surveys, requests] = await Promise.all([
            // All survey responses
            (type === 'all' || type === 'survey')
                ? prisma.surveyResponse.findMany({
                    orderBy: { createdAt: 'desc' },
                    take: limit,
                }).catch(() => [])
                : Promise.resolve([]),

            // Premium requests with quiz/survey metadata
            (type === 'all' || type === 'quiz')
                ? prisma.premiumRequest.findMany({
                    where: {
                        tasksCompleted: { array_contains: 'mini_quiz' },
                    },
                    select: {
                        id: true,
                        email: true,
                        userId: true,
                        tasksCompleted: true,
                        createdAt: true,
                        status: true,
                    },
                    orderBy: { createdAt: 'desc' },
                    take: limit,
                }).catch(() => [])
                : Promise.resolve([]),
        ]);

        // Summary counts
        const [surveyCount, quizCount] = await Promise.all([
            prisma.surveyResponse.count().catch(() => 0),
            prisma.premiumRequest.count({
                where: { tasksCompleted: { array_contains: 'mini_quiz' } },
            }).catch(() => 0),
        ]);

        return res.status(200).json({
            success: true,
            surveys,
            quizRequests: requests,
            summary: { surveys: surveyCount, quizzes: quizCount },
        });
    } catch (err) {
        console.error('Responses API Error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
