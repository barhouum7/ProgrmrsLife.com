import { fetchTweets } from '../../lib/twitter';
import { mockTweets } from '../../lib/mockTweets';
import prisma from '../../lib/prisma';
import { startOfDay, addDays, endOfDay } from 'date-fns';


// const transformTweet = (tweet) => ({
//     id: tweet.id,
//     text: tweet.text,
//     authorId: tweet.authorId,
//     username: tweet.username,
//     displayName: tweet.displayName,
//     created_at: tweet.createdAt.toISOString(),
//     canva_link: tweet.canvaLink,
//     tweet_url: tweet.tweetUrl
// });


// For Testing on Mock Data:
const transformTweet = (tweet) => ({
    id: tweet.id,
    text: tweet.text,
    authorId: tweet.authorId,
    username: tweet.username,
    displayName: tweet.displayName,
    created_at: tweet.createdAt ? new Date(tweet.createdAt).toISOString() : new Date().toISOString(),
    canva_link: tweet.canvaLink,
    tweet_url: tweet.tweetUrl
});


export default async function handler(req, res) {

    try {

        const forceFetch = req.query.force === 'true';
        const bypassDaily = req.query.bypass === 'true';
        const { tweets, cached, rateLimited, error } = await fetchTweets(forceFetch, bypassDaily);

        // Transform tweets before sending to frontend
        const transformedTweets = tweets.map(transformTweet);

        // Add specific error handling for database operations
        try {
            const dbCheck = await prisma.$connect();
            await prisma.apiCallLog.findFirst(); // Test query
        } catch (dbError) {
            console.error('Database Connection Error:', dbError);
            // Still return tweets but log the database error
            return res.status(200).json({
                success: true,
                tweets: tweets,
                cached: false,
                dailyCallMade: false,
                error: 'Database connection failed - Data retrieved but not cached',
                dbError: process.env.NODE_ENV === 'development' ? dbError.message : undefined
            });
        }

        // Get API call status
        const today = new Date();
        const apiLog = await prisma.apiCallLog.findFirst({
            where: {
                date: {
                    gte: startOfDay(today),
                    lte: endOfDay(today)
                }
            }
        });

        const response = {
            success: true,
            timestamp: new Date().toISOString(),
            count: transformedTweets.length,
            tweets: transformedTweets,
            cached,
            // Only consider daily call made if it was successful AND we have cached data
            // dailyCallMade: false,
            dailyCallMade: apiLog?.lastCallSuccess && transformedTweets.length > 0,
            nextRefreshAvailable: cached && (!apiLog?.lastCallSuccess || tweets.length === 0) ? 
                new Date(apiLog.lastCallTime.getTime() + 15 * 60 * 1000) : 
                apiLog ? addDays(startOfDay(today), 1) : null
        };

        if (rateLimited) {
            response.message = 'Rate limit reached. Showing cached data.';
        }
        if (error) {
            response.message = 'Error occurred. Showing cached data.';
        }

        res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate');
        res.status(200).json(response);

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch tweets',
            message: error.message
        });
    }
}