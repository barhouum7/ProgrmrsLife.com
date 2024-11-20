import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { emitVoteUpdate } from '../socketio';

// A helper function to get or generate a user ID
const getUserId = (req) => {
    // In a real app, this would come from authentication
    // For now, we'll use a session ID or generate one
    return req.cookies.userId || crypto.randomUUID();
};


export default async function handler(req, res) {

    // GET request handling
    if (req.method === 'GET') {
        // console.log('Handling GET request for votes');
        try {
            // console.log('Attempting to fetch votes from database...');
            const votes = await prisma.vote.findMany({
                where: {
                    active: true,
                    userId: getUserId(req)  // Only get votes for this user
                },
                select: {
                    tweetId: true,
                    type: true,
                    createdAt: true,
                    userId: true
                }
            });
            // console.log('Successfully fetched votes:', votes);
            return res.status(200).json({
                success: true,
                votes
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
    
        if (!tweetId || !voteType || !action) {
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
                        tweetId,
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
                            tweetId,
                            type: voteType,
                            active: true,
                            userId,
                        }
                    });
                }
            } else if (action === 'remove') {
                await prisma.vote.updateMany({
                    where: {
                        tweetId,
                        userId,
                        type: voteType,
                        active: true,
                    },
                    data: {
                        active: false
                    }
                });
            }
    
            // Get updated counts for all tweets
            const votes = await prisma.vote.findMany({
                where: {
                    active: true,
                },
                select: {
                    tweetId: true,
                    type: true,
                    active: true,
                    createdAt: true
                }
            });
            
            // Log the votes for debugging
            // console.log('Active votes found:', votes);
            
            // Aggregate votes with more detailed logging
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
            
            // console.log('Final formatted counts:', formattedCounts);

            // Set a cookie to maintain user identity
            res.setHeader('Set-Cookie', `userId=${userId}; Path=/; HttpOnly; SameSite=Strict`);
    

            const voteUpdate = {
                counts: formattedCounts,
                lastUpdated: new Date(),
                userId: userId,
                updatedTweetId: tweetId
            };
            
            // Emit the update through Socket.IO
            emitVoteUpdate(voteUpdate);

            return res.status(200).json({
                success: true,
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