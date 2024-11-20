import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get all active votes
        const votes = await prisma.vote.findMany({
            where: {
                active: true,
            },
            select: {
                tweetId: true,
                type: true,
                active: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Group votes by tweetId to track counts and latest vote
        const formattedCounts = votes.reduce((acc, vote) => {
            if (!acc[vote.tweetId]) {
                acc[vote.tweetId] = { 
                    up: 0, 
                    down: 0,
                    latestVote: {
                        type: vote.type,
                        time: vote.createdAt
                    }
                };
            }
            
            // Update counts
            if (vote.type === 'up') {
                acc[vote.tweetId].up++;
            } else if (vote.type === 'down') {
                acc[vote.tweetId].down++;
            }
            
            // Update latest vote if this one is more recent
            if (new Date(vote.createdAt) > new Date(acc[vote.tweetId].latestVote.time)) {
                acc[vote.tweetId].latestVote = {
                    type: vote.type,
                    time: vote.createdAt
                };
            }
            
            return acc;
        }, {});

        return res.status(200).json({ 
            success: true,
            counts: formattedCounts
        });

    } catch (error) {
        console.error('Error fetching vote counts:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Failed to fetch vote counts' 
        });
    }
}