import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// A helper function to get or generate a user ID
const getUserId = (req) => {
    // In a real app, this would come from authentication
    // For now, we'll use a session ID or generate one
    return req.cookies.userId || crypto.randomUUID();
};


export default async function handler(req, res) {

    // GET request handling
    if (req.method === 'GET') {
        try {
            const userId = getUserId(req);
            const votes = await prisma.vote.findMany({
                where: {
                    active: true,
                    userId: userId  // Only get votes for this user
                },
                select: {
                    linkId: true,
                    type: true,
                    createdAt: true,
                    userId: true
                }
            });

            // Set the cookie here too for consistency
            res.setHeader('Set-Cookie', `userId=${userId}; Path=/; HttpOnly; SameSite=Strict`);

            // Map linkId to tweetId for backward compatibility with frontend
            const mappedVotes = votes.map(v => ({
                tweetId: v.linkId,
                type: v.type,
                createdAt: v.createdAt,
                userId: v.userId,
            }));

            return res.status(200).json({
                success: true,
                currentUserId: userId,
                votes: mappedVotes
            });
        } catch (error) {
            console.error('Error fetching votes:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch votes'
            });
        }
    }

    // POST request handling
    if (req.method === 'POST') {

        const { tweetId, voteType, action } = req.body;
        const userId = getUserId(req);

        // Accept both tweetId (legacy) and linkId (new)
        const linkId = req.body.linkId || tweetId;

        if (!linkId || !voteType || !action) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        try {
            if (action === 'add') {
                // First, check if there's already an active vote from this user
                const existingVote = await prisma.vote.findFirst({
                    where: {
                        linkId,
                        userId,
                        active: true,
                    }
                });

                if (existingVote) {
                    // If vote type is different, update it
                    if (existingVote.type !== voteType) {
                        await prisma.vote.update({
                            where: { id: existingVote.id },
                            data: {
                                type: voteType,
                                createdAt: new Date()
                            }
                        });
                    }
                } else {
                    // Create new vote
                    await prisma.vote.create({
                        data: {
                            linkId,
                            type: voteType,
                            active: true,
                            userId,
                        }
                    });

                    // Auto-verify community links on first upvote:
                    // unverified submissions become visible once a user confirms working
                    if (voteType === 'up') {
                        await prisma.canvaLink.updateMany({
                            where: { id: linkId, source: 'community', status: 'unverified' },
                            data: { status: 'verified' },
                        }).catch(() => { });
                    }
                }
            } else if (action === 'remove') {
                await prisma.vote.updateMany({
                    where: {
                        linkId,
                        userId,
                        type: voteType,
                        active: true,
                    },
                    data: {
                        active: false
                    }
                });
            }

            // Get updated counts for all links
            const votes = await prisma.vote.findMany({
                where: {
                    active: true,
                },
                select: {
                    linkId: true,
                    type: true,
                    active: true,
                    createdAt: true
                }
            });

            // Aggregate votes
            const formattedCounts = votes.reduce((acc, vote) => {
                if (!acc[vote.linkId]) {
                    acc[vote.linkId] = {
                        up: 0,
                        down: 0,
                        latestVote: {
                            type: vote.type,
                            time: vote.createdAt
                        }
                    };
                }

                if (vote.type === 'up') {
                    acc[vote.linkId].up++;
                } else if (vote.type === 'down') {
                    acc[vote.linkId].down++;
                }

                // Update latest vote if this one is more recent
                if (new Date(vote.createdAt) > new Date(acc[vote.linkId].latestVote.time)) {
                    acc[vote.linkId].latestVote = {
                        type: vote.type,
                        time: vote.createdAt
                    };
                }

                return acc;
            }, {});

            // Set a cookie to maintain user identity
            res.setHeader('Set-Cookie', `userId=${userId}; Path=/; HttpOnly; SameSite=Strict`);

            const voteUpdate = {
                counts: formattedCounts,
                lastUpdated: new Date(),
                userId: userId,
                updatedTweetId: linkId
            };

            // Vote update data (picked up by client polling)

            return res.status(200).json({
                success: true,
                currentUserId: userId,
                ...voteUpdate
            });

        } catch (error) {
            console.error('Error processing vote:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to process vote'
            });
        }
    }

    // Handle unsupported methods
    return res.status(405).json({
        success: false,
        error: 'Method not allowed'
    });

}