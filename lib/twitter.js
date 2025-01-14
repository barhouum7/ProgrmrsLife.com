import prisma from './prisma';
import { addDays, startOfDay, endOfDay } from 'date-fns';
import fs from 'fs/promises';
import path from 'path';

import axios from 'axios';

import { mockTweets } from './mockTweets';

const isMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
const isDev = process.env.NODE_ENV !== 'production';



// Implements a token rotation system that switches to the next token when encountering rate limits
// Array of available bearer tokens
const BEARER_TOKENS = [
    process.env.TWITTER_BEARER_TOKEN,
    process.env.TWITTER_2_BEARER_TOKEN,
    process.env.TWITTER_3_BEARER_TOKEN
].filter(Boolean);

let currentTokenIndex = 0;

// Keep track of the last check time and token index
let lastCheckData = {
    date: null,
    tokenIndex: 0,
    nextCheckTime: null
};

const getNextBearerToken = () => {
    currentTokenIndex = (currentTokenIndex + 1) % BEARER_TOKENS.length;
    return BEARER_TOKENS[currentTokenIndex];
};

const getNextCheckTime = () => {
    const now = new Date();
    const nextCheck = new Date(now);
    nextCheck.setUTCHours(12, 0, 0, 0);
    
    // If it's past 12:00 PM UTC today, set for tomorrow
    if (now >= nextCheck) {
        nextCheck.setUTCDate(nextCheck.getUTCDate() + 1);
    }
    
    return nextCheck;
};

const shouldMakeNewCheck = () => {
    const now = new Date();
    
    // If no previous check or next check time
    if (!lastCheckData.date || !lastCheckData.nextCheckTime) {
        return true;
    }
    
    return now >= new Date(lastCheckData.nextCheckTime);
};

const makeTwitterRequest = async (url) => {
    // Check if we should make a new token check
    if (shouldMakeNewCheck()) {
        currentTokenIndex = 0; // Reset to first token
        lastCheckData = {
            date: new Date(),
            tokenIndex: 0,
            nextCheckTime: getNextCheckTime()
        };
        console.log(`New check cycle started. Next check at: ${lastCheckData.nextCheckTime}`);
    } else {
        currentTokenIndex = lastCheckData.tokenIndex;
        console.log(`Using existing token (index: ${currentTokenIndex + 1}). Next check at: ${lastCheckData.nextCheckTime}`);
    }

    let attempts = 0;
    const maxAttempts = BEARER_TOKENS.length;

    while (attempts < maxAttempts) {
        try {
            console.log(`Attempting request with token ${currentTokenIndex + 1}`);
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${BEARER_TOKENS[currentTokenIndex]}`,
                },
            });
            
            // Store successful token data
            lastCheckData.tokenIndex = currentTokenIndex;
            console.log(`Request successful with token ${currentTokenIndex + 1}`);
            
            return response;
        } catch (error) {
            if (error.response?.status === 429) { // Rate limit error
                console.log(`Rate limit reached for token ${currentTokenIndex + 1}, trying next token...`);
                const nextToken = getNextBearerToken();
                if (!nextToken) {
                    throw new Error('All tokens are rate limited');
                }
                attempts++;
                continue;
            }
            throw error;
        }
    }
    throw new Error('All tokens are rate limited');
};


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
    

    // const ALLOWED_USERS = ['canva_in', 'comfystas', 'miaucitaz', 'ancheidesigns', 'ahmedservices7', 'omoalhajaabiola'];

    // const userFilter = ALLOWED_USERS.map(user => `from:${user}`).join(' OR ');
    // (${userFilter}) 
    const query = encodeURIComponent(`
        url:"canva.com/brand/join" token referrer=team-invite 
        has:links
        -is:retweet 
        -is:quote
        -is:reply
        `.replace(/\s+/g, ' ').trim()); // Remove excess spaces and trim the query string

    // const query = encodeURIComponent('url:"canva.com/brand/join" token referrer=team-invite -is:retweet -is:reply');
    // We can fetch only 10 tweets instead of 100 (Which is the maximum results allowed in the Twitter API Free Plan)
    // Add from:username1 OR from:username2 if you want specific users
    const url = `https://api.twitter.com/2/tweets/search/recent?query=${query}&tweet.fields=created_at,author_id,entities&expansions=author_id&user.fields=username,name&max_results=10&sort_order=recency`;
    

    try {
        console.log('[ FetchTweets | lib/twitter.js ] Fetching tweets...');

        let processedTweets;
        let rawResponse;

        if (isMockData) {
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

                const response = await makeTwitterRequest(url);

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
        if (isDev && (rawResponse || processedTweets?.length > 0)) {
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
                    // // Instead of updating existing ones and adding new ones, delete old tweets and ensure that the database has only 10 latest added tweets and update if there's existing
                    // // Delete old tweets and ensure the database has only the 10 latest added tweets
                    // const latestTweets = processedTweets.slice(-10); // Get the 10 latest tweets
                    // await prisma.tweet.deleteMany({
                    //     where: {
                    //         id: {
                    //             notIn: latestTweets.map(tweet => tweet.id)
                    //         }
                    //     }
                    // });
                    
                    // for (const tweet of latestTweets) {
                    //     await prisma.tweet.upsert({
                    //         where: { id: tweet.id },
                    //         create: tweet,
                    //         update: tweet
                    //     });
                    // }



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