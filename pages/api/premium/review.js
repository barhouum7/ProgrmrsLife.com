/**
 * POST /api/premium/review    — Submit a review, feedback, or report
 * GET  /api/premium/review    — Admin: list all reviews (requires ?key=ADMIN_SECRET)
 * PATCH /api/premium/review   — Admin: approve or delete a review
 *
 * POST body: { type: 'review'|'feedback'|'report', rating?: 1-5, displayName?: string, text: string }
 */

import prisma from '../../../lib/prisma';
import crypto from 'crypto';

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const getUserId = (req) => req.cookies.userId || crypto.randomUUID();

function isAdmin(req) {
    const key = req.query.key || req.body?.key || req.headers['x-admin-key'];
    return !!ADMIN_SECRET && key === ADMIN_SECRET;
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');

    // ── GET: Admin list all reviews ────────────────────────────────
    if (req.method === 'GET') {
        if (!isAdmin(req)) return res.status(401).json({ success: false, error: 'Unauthorized' });
        try {
            const ts = Date.now();
            const reviews = await prisma.premiumReview.findMany({
                orderBy: { createdAt: 'desc' },
                take: 100,
            });
            const summary = {
                total: reviews.length,
                approved: reviews.filter(r => r.approved).length,
                pending: reviews.filter(r => !r.approved).length,
                byType: reviews.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc; }, {}),
            };
            return res.status(200).json({ success: true, reviews, summary });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    }

    // ── POST: Submit a review/feedback/report ─────────────────────
    if (req.method === 'POST') {
        try {
            const userId = getUserId(req);
            const { type = 'review', rating, displayName, text } = req.body;

            if (!text || text.trim().length < 10) {
                return res.status(400).json({ success: false, error: 'Please write at least 10 characters.' });
            }
            if (text.trim().length > 1000) {
                return res.status(400).json({ success: false, error: 'Text too long (max 1000 characters).' });
            }
            if (!['review', 'feedback', 'report'].includes(type)) {
                return res.status(400).json({ success: false, error: 'Invalid type.' });
            }
            if (type === 'review' && (!rating || rating < 1 || rating > 5)) {
                return res.status(400).json({ success: false, error: 'Rating (1-5) is required for reviews.' });
            }

            // Rate-limit: one submission per userId per type
            const existing = await prisma.premiumReview.findFirst({
                where: { userId, type },
            });
            if (existing) {
                return res.status(429).json({
                    success: false,
                    error: 'You have already submitted a ' + type + '. Thank you!',
                });
            }

            const review = await prisma.premiumReview.create({
                data: {
                    userId,
                    type,
                    rating: type === 'review' ? parseInt(rating, 10) : null,
                    displayName: displayName?.trim().slice(0, 50) || null,
                    text: text.trim().slice(0, 1000),
                    approved: false, // awaits admin approval
                },
            });

            // Notify admin for reports
            if (type === 'report') {
                try {
                    const nodemailer = await import('nodemailer');
                    if (process.env.EMAIL_HOST && process.env.ADMIN_EMAIL) {
                        const t = nodemailer.default.createTransport({
                            host: process.env.EMAIL_HOST,
                            port: parseInt(process.env.EMAIL_PORT || '465', 10),
                            secure: (process.env.EMAIL_PORT || '465') === '465',
                            auth: { user: process.env.AUTH_EMAIL_ADDRESS, pass: process.env.AUTH_EMAIL_PASS },
                        });
                        await t.sendMail({
                            from: `"ProgrmrsLife" <${process.env.AUTH_EMAIL_ADDRESS}>`,
                            to: process.env.ADMIN_EMAIL,
                            subject: '🚨 New issue report on Canva Pro page',
                            text: `User ${userId} reported an issue:\n\n${text}\n\nReview at: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.progrmrslife.com'}/admin/premium`,
                        });
                    }
                } catch { /* silent */ }
            }

            return res.status(201).json({
                success: true,
                message: type === 'report'
                    ? 'Issue reported. We\'ll review it shortly!'
                    : type === 'feedback'
                        ? 'Thanks for your feedback!'
                        : 'Review submitted! It\'ll appear after quick approval.',
            });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    }

    // ── PATCH: Admin approve/delete a review ──────────────────────
    if (req.method === 'PATCH') {
        if (!isAdmin(req)) return res.status(401).json({ success: false, error: 'Unauthorized' });
        try {
            const { reviewId, action } = req.body;
            if (!reviewId || !['approve', 'reject'].includes(action)) {
                return res.status(400).json({ success: false, error: 'reviewId and action (approve|reject) required' });
            }
            if (action === 'approve') {
                await prisma.premiumReview.update({ where: { id: reviewId }, data: { approved: true } });
                return res.status(200).json({ success: true });
            }
            // reject = hard delete
            setTimeout(() => {
                prisma.premiumReview.delete({ where: { id: reviewId } }).catch(() => { });
            }, 2000);
            return res.status(200).json({ success: true });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
}
