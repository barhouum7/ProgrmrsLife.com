/**
 * Community Source — Handles user-submitted Canva invite links
 * 
 * Fetches approved community submissions from the database.
 * Submissions are validated and rate-limited in the API route.
 */

import prisma from '../prisma';

/**
 * Fetch community-submitted links that are still active
 */
export async function fetchCommunityLinks() {
    try {
        const links = await prisma.canvaLink.findMany({
            where: {
                source: 'community',
                // Only show verified links publicly.
                // Submitted links start as 'unverified' and are hidden until
                // an admin approves them or a working upvote auto-verifies them.
                status: 'verified',
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });

        return links.map(link => ({
            url: link.url,
            source: 'community',
            sourceRef: link.sourceRef,
            authorName: link.authorName || 'Community Member',
            createdAt: link.createdAt,
        }));
    } catch (error) {
        console.error('[Community] Error fetching links:', error.message);
        return [];
    }
}


/**
 * Submit a new community link
 * Called from the API route after validation
 */
export async function submitCommunityLink({ url, userId, authorName }) {
    // Validate URL format
    const CANVA_URL_VALIDATOR = /^https?:\/\/(www\.)?canva\.com\/brand\/join\?.*token=.+&.*referrer=team-invite/i;

    if (!CANVA_URL_VALIDATOR.test(url)) {
        throw new Error('Invalid Canva invite link format. URL must contain canva.com/brand/join with token and referrer=team-invite parameters.');
    }

    // Check for duplicates
    const existing = await prisma.canvaLink.findUnique({
        where: { url },
    });

    if (existing) {
        throw new Error('This link has already been submitted.');
    }

    // Rate limit: max 3 submissions per user per day
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentSubmissions = await prisma.canvaLink.count({
        where: {
            source: 'community',
            submittedBy: userId,
            createdAt: { gte: oneDayAgo },
        },
    });

    if (recentSubmissions >= 3) {
        throw new Error('You can submit up to 3 links per day. Please try again tomorrow.');
    }

    // Create the link
    const link = await prisma.canvaLink.create({
        data: {
            url,
            source: 'community',
            sourceRef: `user:${userId}`,
            authorName: authorName || 'Community Member',
            status: 'unverified',
            submittedBy: userId,
        },
    });

    return link;
}
