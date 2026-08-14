/**
 * POST /api/premium/request — Submit premium team access request
 * GET  /api/premium/request — Check current request status
 * 
 * Users complete support tasks and submit their email to request
 * access to the exclusive private Canva Pro team.
 */

import prisma from '../../../lib/prisma';
import crypto from 'crypto';
import {
    sendRequestReceivedEmail,
    sendAccessExpiredEmail,
} from '../../../lib/email';

// Admin notification helper — non-blocking fire-and-forget
async function notifyAdmin(subject, text) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) return;
    const { sendEmail } = await import('../../../lib/email').catch(() => ({ sendEmail: null }));
    // Use the internal sendEmail directly — reuse the same transporter
    try {
        const nodemailer = await import('nodemailer');
        if (!process.env.EMAIL_HOST) return;
        const t = nodemailer.default.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '465', 10),
            secure: (process.env.EMAIL_PORT || '465') === '465',
            auth: { user: process.env.AUTH_EMAIL_ADDRESS, pass: process.env.AUTH_EMAIL_PASS },
        });
        await t.sendMail({
            from: `"ProgrmrsLife Admin" <'admin@progrmrslife.com'}>`,
            to: adminEmail,
            subject,
            text,
        });
    } catch (e) { console.warn('[Admin Email]', e.message); }
}

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds
const getUserId = (req) => req.cookies.userId || crypto.randomUUID();

// Required tasks — ALL must be completed to qualify
const REQUIRED_TASKS = ['mini_quiz', 'survey', 'subscribe_youtube'];

const VALID_TASKS = [
    'mini_quiz',
    'survey',
    'subscribe_youtube',
    'share_facebook',
    'share_twitter',
    'join_telegram',
    'rewarded_ad',
    'referral',
];

export default async function handler(req, res) {
    const userId = getUserId(req);
    res.setHeader('Set-Cookie', `userId=${userId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${COOKIE_MAX_AGE}`);

    // ── GET: Check request status ───────────────────────────────
    if (req.method === 'GET') {
        try {
            const request = await prisma.premiumRequest.findFirst({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            });

            if (!request) {
                return res.status(200).json({
                    success: true,
                    status: 'none',
                    message: 'No premium request found. Complete tasks to get started!',
                });
            }

            // Detect & auto-mark expired
            if (request.status === 'active' && request.expiresAt && new Date() > new Date(request.expiresAt)) {
                await prisma.premiumRequest.update({
                    where: { id: request.id },
                    data: { status: 'expired' },
                });
                sendAccessExpiredEmail(request.email).catch(() => { });
                return res.status(200).json({
                    success: true,
                    status: 'expired',
                    message: 'Your premium access has expired. Complete tasks again to renew!',
                    expiresAt: request.expiresAt,
                });
            }

            // Never cache — status must always be fresh
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
            return res.status(200).json({
                success: true,
                status: request.status,
                email: request.email,
                tasksCompleted: request.tasksCompleted,
                approvedAt: request.approvedAt,
                expiresAt: request.expiresAt,
                createdAt: request.createdAt,
            });

        } catch (error) {
            console.error('Premium Status Error:', error);
            return res.status(500).json({ success: false, error: 'Failed to check status' });
        }
    }

    // ── POST: Submit premium request ────────────────────────────
    if (req.method === 'POST') {
        try {
            const { email, tasksCompleted } = req.body;

            if (!email || !email.includes('@')) {
                return res.status(400).json({
                    success: false,
                    error: 'A valid email address is required.',
                });
            }

            // Validate tasks — all 3 required tasks must be present
            const validTasks = (tasksCompleted || []).filter(t => VALID_TASKS.includes(t));
            const missingRequired = REQUIRED_TASKS.filter(t => !validTasks.includes(t));
            if (missingRequired.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: `Missing required tasks: ${missingRequired.join(', ')}`,
                    missingTasks: missingRequired,
                });
            }

            // ── Block: same userId already has an active/pending request
            const existingByUserId = await prisma.premiumRequest.findFirst({
                where: {
                    userId,
                    status: { in: ['tasks_completed', 'approved', 'active', 'pending'] },
                },
            });
            if (existingByUserId) {
                return res.status(200).json({
                    success: true,
                    status: existingByUserId.status,
                    email: existingByUserId.email,
                    tasksCompleted: existingByUserId.tasksCompleted,
                    approvedAt: existingByUserId.approvedAt,
                    expiresAt: existingByUserId.expiresAt,
                    message: 'You already have an active request. Submit a new one only after it is resolved.',
                });
            }

            // ── Check if email already has an active/pending request
            const existing = await prisma.premiumRequest.findUnique({
                where: { email: email.toLowerCase().trim() },
            });

            if (existing) {
                if (existing.status === 'active') {
                    return res.status(200).json({
                        success: true,
                        status: 'active',
                        message: 'You already have active premium access!',
                        expiresAt: existing.expiresAt,
                    });
                }
                if (existing.status === 'pending' || existing.status === 'tasks_completed') {
                    return res.status(200).json({
                        success: true,
                        status: existing.status,
                        message: 'Your request is already being reviewed. Please be patient!',
                    });
                }

                // If expired or rejected, allow re-submission
                await prisma.premiumRequest.update({
                    where: { email: email.toLowerCase().trim() },
                    data: {
                        userId,
                        status: 'tasks_completed',
                        tasksCompleted: validTasks,
                        approvedAt: null,
                        expiresAt: null,
                        adminNotes: null,
                    },
                });
            } else {
                await prisma.premiumRequest.create({
                    data: {
                        email: email.toLowerCase().trim(),
                        userId,
                        status: 'tasks_completed',
                        tasksCompleted: validTasks,
                    },
                });
            }

            // Send confirmation + admin notification (non-blocking)
            sendRequestReceivedEmail(email.toLowerCase().trim()).catch(() => { });
            notifyAdmin(
                `📨 New premium request from ${email.toLowerCase().trim()}`,
                `User ${userId} submitted a premium access request at ${new Date().toISOString()}.\n\nTasks: ${validTasks.join(', ')}\n\nReview at: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.progrmrslife.com'}/admin/premium`
            ).catch(() => { });

            return res.status(201).json({
                success: true,
                status: 'tasks_completed',
                message: 'Your request has been submitted! We will review it and add you to the team as soon as possible.',
                tasksCompleted: validTasks,
            });

        } catch (error) {
            console.error('Premium Request Error:', error);
            return res.status(500).json({ success: false, error: 'Failed to submit request' });
        }
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
}
