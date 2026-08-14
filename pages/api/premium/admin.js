/**
 * Premium Admin API — Manage premium team requests
 * 
 * Protected by ADMIN_SECRET env variable.
 * 
 * GET  /api/premium/admin?key=SECRET — List pending requests
 * POST /api/premium/admin — Approve/reject/activate requests
 */

import prisma from '../../../lib/prisma';
import { addMonths } from 'date-fns';
import {
    sendRequestApprovedEmail,
    sendAccessActivatedEmail,
    sendRequestRejectedEmail,
    sendAccessExpiredEmail,
} from '../../../lib/email';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

function verifyAdmin(req) {
    const key = req.query.key || req.body.key || req.headers['x-admin-key'];
    if (!ADMIN_SECRET || key !== ADMIN_SECRET) {
        return false;
    }
    return true;
}

export default async function handler(req, res) {
    if (!verifyAdmin(req)) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // ── GET: List requests ──────────────────────────────────────
    if (req.method === 'GET') {
        try {
            const statusFilter = req.query.status || 'tasks_completed';

            const requests = await prisma.premiumRequest.findMany({
                where: statusFilter === 'all' ? {} : { status: statusFilter },
                orderBy: { createdAt: 'desc' },
            });

            // Get summary counts
            const counts = await prisma.premiumRequest.groupBy({
                by: ['status'],
                _count: { status: true },
            });

            const summary = counts.reduce((acc, item) => {
                acc[item.status] = item._count.status;
                return acc;
            }, {});

            return res.status(200).json({
                success: true,
                requests,
                summary,
                total: requests.length,
            });

        } catch (error) {
            console.error('Admin List Error:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch requests' });
        }
    }

    // ── POST: Approve/Reject/Activate ───────────────────────────
    if (req.method === 'POST') {
        try {
            const { requestId, action, adminNotes, durationMonths } = req.body;

            if (!requestId || !action) {
                return res.status(400).json({
                    success: false,
                    error: 'requestId and action are required',
                });
            }

            const request = await prisma.premiumRequest.findUnique({
                where: { id: requestId },
            });

            if (!request) {
                return res.status(404).json({ success: false, error: 'Request not found' });
            }

            let updateData = {};

            switch (action) {
                case 'approve':
                    // Mark as approved — admin will manually add to Canva team
                    updateData = {
                        status: 'approved',
                        approvedAt: new Date(),
                        adminNotes: adminNotes || null,
                    };
                    break;

                case 'activate':
                    // Mark as active — user has been added to Canva team
                    const months = durationMonths || 1;
                    updateData = {
                        status: 'active',
                        approvedAt: request.approvedAt || new Date(),
                        expiresAt: addMonths(new Date(), months),
                        adminNotes: adminNotes || `${months}-month access activated`,
                    };
                    break;

                case 'reject':
                    updateData = {
                        status: 'rejected',
                        adminNotes: adminNotes || 'Request rejected',
                    };
                    break;

                case 'expire':
                    updateData = {
                        status: 'expired',
                        adminNotes: adminNotes || 'Manually expired by admin',
                    };
                    break;

                default:
                    return res.status(400).json({
                        success: false,
                        error: `Invalid action: ${action}. Use: approve, activate, reject, expire`,
                    });
            }

            const updated = await prisma.premiumRequest.update({
                where: { id: requestId },
                data: updateData,
            });

            // Fire-and-forget email notifications
            if (action === 'approve') sendRequestApprovedEmail(request.email).catch(() => { });
            if (action === 'activate') sendAccessActivatedEmail(request.email, updated.expiresAt).catch(() => { });
            if (action === 'reject') sendRequestRejectedEmail(request.email, adminNotes).catch(() => { });
            if (action === 'expire') sendAccessExpiredEmail(request.email).catch(() => { });

            return res.status(200).json({
                success: true,
                message: `Request ${action}d successfully`,
                request: updated,
            });

        } catch (error) {
            console.error('Admin Action Error:', error);
            return res.status(500).json({ success: false, error: 'Failed to process action' });
        }
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
}
