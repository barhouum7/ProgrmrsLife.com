import prisma from './prisma';
import { addDays, startOfDay, endOfDay } from 'date-fns';
import fs from 'fs/promises';
import path from 'path';

import axios from 'axios';

import { mockTweets } from './mockTweets';

const isDev = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';


const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;


// Add a helper function for database operations with retry logic
const executeWithRetry = async (operation, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            if (attempt === maxRetries) throw error;
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            // Ensure DB connection is alive
            await prisma.$connect();
        }
    }
};


export const fetchTweets = async (forceFetch = false, bypassDaily = false) => {
    // Check if we've made an API call today
    const today = new Date();
    const RETRY_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds

    // Skip daily check if bypass is true
    if (!bypassDaily) {
        const apiLog = await prisma.apiCallLog.findFirst({
            where: {
                date: {
                    gte: startOfDay(today),
                    lte: endOfDay(today)
                }
            }
        });
        
        // Check if we have any cached tweets
        const cachedTweets = await prisma.tweet.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10
        });
        
        // If we have a successful call today and cached data, return cached data
        if (apiLog?.lastCallSuccess && cachedTweets.length > 0) {
            return { tweets: cachedTweets, cached: true };
        }
        
        // If we have a failed call, check if enough time has passed OR if we have no cached data
        if (apiLog?.lastCallTime) {
            const timeSinceLastCall = Date.now() - new Date(apiLog.lastCallTime).getTime();
            if (timeSinceLastCall < RETRY_INTERVAL && cachedTweets.length > 0) {
                return { 
                    tweets: cachedTweets, 
                    cached: true, 
                    retryAfter: new Date(apiLog.lastCallTime.getTime() + RETRY_INTERVAL)
                };
            }
        }
    }
    

    const ALLOWED_USERS = ['canva_in', 'comfystas', 'miaucitaz', 'ancheidesigns', 'ahmedservices7', 'omoalhajaabiola'];

    const userFilter = ALLOWED_USERS.map(user => `from:${user}`).join(' OR ');
    const query = encodeURIComponent(`(${userFilter}) url:"canva.com/brand/join" token referrer=team-invite -is:retweet -is:reply`);

    // const query = encodeURIComponent('url:"canva.com/brand/join" token referrer=team-invite -is:retweet -is:reply');
    // We can fetch only 10 tweets instead of 100 (Which is the maximum results allowed in the Twitter API Free Plan)
    // Add from:username1 OR from:username2 if you want specific users
    const url = `https://api.twitter.com/2/tweets/search/recent?query=${query}&tweet.fields=created_at,author_id,entities&expansions=author_id&user.fields=username,name&max_results=10&sort_order=recency`;
    

    try {
        console.log('[ FetchTweets | lib/twitter.js ] Fetching tweets...');

        let processedTweets;
        let rawResponse;

        if (isDev) {
            // console.log('[ FetchTweets | lib/twitter.js ] Using mock data in development');
            // Use mock data in development but still store it
            processedTweets = mockTweets
                .slice(0, 10)
                .map(tweet => {
                    const canvaLink = tweet.entities?.urls?.[0]?.expanded_url || tweet.canvaLink;

                    if (!canvaLink) return null;

                    return {
                        id: tweet.id,
                        text: tweet.text,
                        authorId: tweet.author_id || tweet.authorId,
                        username: tweet.username,
                        displayName: tweet.displayName,
                        created_at: tweet.created_at || tweet.createdAt,
                        canvaLink: canvaLink,
                        tweetUrl: tweet.tweet_url || tweet.tweetUrl
                    };
                })
                .filter(Boolean)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first
            
            // console.log('[ FetchTweets | lib/twitter.js ] Processed mock tweets:', processedTweets.length);
            rawResponse = { data: mockTweets };
            // console.log('[ FetchTweets | lib/twitter.js ] Raw mock response:', rawResponse.data.length);

            // console.log('[ FetchTweets | lib/twitter.js ] Simulating API delay...');
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        } else {
            // Real API call in production
            try {
                console.log('**** Using Real API call in production');

                const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${BEARER_TOKEN}`,
                },
                });

                console.log('Twitter API Response:', {
                    status: response.status,
                    data: response.data,
                    headers: response.headers
                });

                // Store raw response data
                rawResponse = response.data;

                const tweets = response.data.data || [];
                const users = response.data.includes?.users || [];
                
                // For Testing on Mock Data:
                // // Using mock data for testing
                // const tweets = mockTweets;
                // // console.log("[ FetchTweets | lib/twitter.js ] Tweets: ", tweets);

                // const users = mockTweets.map(tweet => ({
                //     ...tweet,
                //     authorId: tweet.author_id,
                //     createdAt: new Date(tweet.created_at).toISOString(),
                //     canva_link: tweet.entities?.urls?.[0]?.expanded_url || tweet.canvaLink,
                //     tweet_url: tweet.tweetUrl
                // }));

                // console.log("[ FetchTweets | lib/twitter.js ] users: ", users);

                // Process tweets to extract Canva links and user info
                // Ensure we only process up to 10 tweets
                processedTweets = tweets
                .slice(0, 10)
                .map(tweet => {
                    const canvaLink = tweet.entities?.urls?.find(url => {
                        const expandedUrl = url.expanded_url?.toLowerCase();
                        return expandedUrl?.includes('canva.com/brand/join') && 
                               expandedUrl?.includes('token=') && 
                               expandedUrl?.includes('referrer=team-invite');
                    })?.expanded_url;

                    if (!canvaLink) return null;

                    const author = users.find(user => user.id === tweet.author_id);

                    return {
                        id: tweet.id,
                        text: tweet.text,
                        authorId: tweet.author_id,
                        username: author?.username || 'unknown',
                        displayName: author?.name || 'Unknown User',
                        createdAt: new Date(tweet.created_at).toISOString(),
                        canvaLink: canvaLink,
                        tweetUrl: `https://twitter.com/${author?.username}/status/${tweet.id}`
                    };
                })
                .filter(Boolean)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first


                // For Testing on Mock Data:
                // processedTweets = tweets
                // .slice(0, 10)
                // .map(tweet => {
                //     const canvaLink = tweet.entities?.urls?.[0]?.expanded_url || tweet.canvaLink;

                //     if (!canvaLink) return null;

                //     return {
                //         id: tweet.id,
                //         text: tweet.text,
                //         authorId: tweet.author_id || tweet.authorId,
                //         username: tweet.username,
                //         displayName: tweet.displayName,
                //         created_at: tweet.created_at || tweet.createdAt,
                //         canvaLink: canvaLink,
                //         tweetUrl: tweet.tweet_url || tweet.tweetUrl
                //     };
                // })
                // .filter(Boolean);

                console.log("[ FetchTweets | lib/twitter.js ] processedTweets: ", processedTweets.length);

            } catch (error) {
                console.error('Twitter API Error:', {
                    status: error.response?.status,
                    message: error.message,
                    data: error.response?.data,
                    query: url
                });

                // On failed API call
                await prisma.apiCallLog.upsert({
                    where: { date: startOfDay(today) },
                    create: { 
                        date: startOfDay(today), 
                        callCount: 1,
                        lastCallTime: new Date(),
                        lastCallSuccess: false
                    },
                    update: { 
                        callCount: { increment: 1 },
                        lastCallTime: new Date(),
                        lastCallSuccess: false
                    }
                });

                if (error.response?.status === 429) {
                    // If rate limited, return cached data
                    const cachedTweets = await prisma.tweet.findMany({
                        orderBy: { createdAt: 'desc' },
                        take: 10
                    });
                    return { tweets: cachedTweets, cached: true, rateLimited: true };
                }
                throw error;
            }
        }

        console.log("[ FetchTweets | lib/twitter.js ] processedTweets: ", processedTweets.length);

        // Save tweets locally before database operation
        // Save both raw and processed tweets locally
        if (rawResponse || processedTweets?.length > 0) {
            try {
                const backupDir = path.join(process.cwd(), 'data', 'tweet-backups');
                await fs.mkdir(backupDir, { recursive: true });
                
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                
                // Save raw response
                if (rawResponse) {
                    const rawBackupPath = path.join(backupDir, `raw-tweets-${timestamp}.json`);
                    await fs.writeFile(
                        rawBackupPath,
                        JSON.stringify(rawResponse, null, 2)
                    );
                    console.log(`Raw tweets backed up to ${rawBackupPath}`);
                }
                
                // Save processed tweets
                if (processedTweets?.length > 0) {
                    const processedBackupPath = path.join(backupDir, `processed-tweets-${timestamp}.json`);
                    await fs.writeFile(
                        processedBackupPath,
                        JSON.stringify(processedTweets, null, 2)
                    );
                    console.log(`Processed tweets backed up to ${processedBackupPath}`);
                }
            } catch (backupError) {
                console.error('Error saving local backup:', backupError);
                // Continue with database operation even if backup fails
            }
        }

        // Save tweets to database (for both dev and prod)
        if (processedTweets?.length > 0) {
            try {
                console.log('Starting database operations...');
            
                // Split the transaction into smaller operations
                await executeWithRetry(async () => {
                    // First operation: Update API call log
                    const apiLogResult = await prisma.apiCallLog.upsert({
                        where: { date: startOfDay(today) },
                        create: { 
                            date: startOfDay(today), 
                            callCount: 1,
                            lastCallTime: new Date(),
                            lastCallSuccess: true
                        },
                        update: { 
                            callCount: { increment: 1 },
                            lastCallTime: new Date(),
                            lastCallSuccess: true
                        }
                    });
                    console.log('API call log updated:', apiLogResult);
                });

                await executeWithRetry(async () => {
                    // Instead of deleting all tweets, update existing ones and add new ones
                    for (const tweet of processedTweets) {
                        await prisma.tweet.upsert({
                            where: { id: tweet.id },
                            create: tweet,
                            update: tweet
                        });
                    }
                
                    // Delete votes for tweets that no longer exist
                    const existingTweetIds = processedTweets.map(t => t.id);
                    const deleteVotesResult = await prisma.vote.deleteMany({
                        where: {
                            tweetId: {
                                notIn: existingTweetIds
                            }
                        }
                    });
                    console.log(`Deleted ${deleteVotesResult.count} votes for non-existent tweets`);

                });


                // Third operation: Insert new tweets in batches
                const BATCH_SIZE = 3;
                const sortedTweets = processedTweets
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                for (let i = 0; i < sortedTweets.length; i += BATCH_SIZE) {
                    const batch = sortedTweets.slice(i, i + BATCH_SIZE);
                    await executeWithRetry(async () => {
                        const createdTweets = await Promise.all(
                            batch.map(tweet => 
                                prisma.tweet.upsert({
                                    where: { id: tweet.id },
                                    update: {
                                        text: tweet.text,
                                        authorId: tweet.authorId,
                                        username: tweet.username,
                                        displayName: tweet.displayName,
                                        createdAt: new Date(tweet.createdAt),
                                        canvaLink: tweet.canvaLink,
                                        tweetUrl: tweet.tweetUrl
                                    },
                                    create: {
                                        id: tweet.id,
                                        text: tweet.text,
                                        authorId: tweet.authorId,
                                        username: tweet.username,
                                        displayName: tweet.displayName,
                                        createdAt: new Date(tweet.createdAt),
                                        canvaLink: tweet.canvaLink,
                                        tweetUrl: tweet.tweetUrl
                                    }
                                })
                            )
                        );
                        console.log(`Successfully stored batch of ${createdTweets.length} tweets`);
                    });
                }

                console.log('All database operations completed successfully');

            } catch (dbError) {
                console.error('Database Error:', {
                    message: dbError.message,
                    code: dbError.code,
                    meta: dbError.meta
                });
                
                // Attempt to reconnect to the database
                try {
                    await prisma.$connect();
                } catch (connectError) {
                    console.error('Failed to reconnect to database:', connectError);
                }
                
                return { 
                    tweets: processedTweets, 
                    cached: false,
                    error: 'Data retrieved but could not be saved to database'
                };
            }
        }

        return { tweets: processedTweets || [], cached: false };

    } catch (error) {
        console.error('Error fetching tweets:', {
            status: error.response?.status,
            message: error.message,
            data: error.response?.data
        });

        // Return most recent cached tweets from database
        const cachedTweets = await prisma.tweet.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        return { tweets: cachedTweets, cached: true, error: true };
    }
};