/**
 * POST /api/links/submit — Community link submission endpoint
 * 
 * Allows users to submit Canva Pro invite links.
 * Includes validation, duplicate detection, and rate limiting.
 */

import { submitCommunityLink } from '../../../lib/sources/community';
import crypto from 'crypto';

// Get or generate a user ID from cookies
const getUserId = (req) => {
    return req.cookies.userId || crypto.randomUUID();
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const userId = getUserId(req);
        const { url, authorName } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'URL is required',
            });
        }

        const link = await submitCommunityLink({
            url: url.trim(),
            userId,
            authorName: authorName?.trim() || 'Community Member',
        });

        // Set cookie
        res.setHeader('Set-Cookie', `userId=${userId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 365}`);

        res.status(201).json({
            success: true,
            link: {
                id: link.id,
                url: link.url,
                source: link.source,
                authorName: link.authorName,
                status: link.status,
                created_at: link.createdAt.toISOString(),
            },
            message: 'Link submitted successfully! It will appear after verification.',
        });

    } catch (error) {
        console.error('Submit Error:', error);

        // Determine appropriate status code from error message
        const statusCode = error.message.includes('already been submitted') ? 409
            : error.message.includes('Invalid') ? 400
                : error.message.includes('up to 3') ? 429
                    : 500;

        res.status(statusCode).json({
            success: false,
            error: error.message || 'Failed to submit link',
        });
    }
}
