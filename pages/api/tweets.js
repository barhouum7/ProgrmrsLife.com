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
        if (error) {
            console.error('Twitter API Error:', error); // Log the error for debugging
            return res.status(500).json({ success: false, error: error.message || 'Failed to fetch tweets from Twitter API.' });
        }

        // Transform tweets before sending to frontend
        const transformedTweets = tweets.map(transformTweet);

        // Add specific error handling for database operations
        try {
            await prisma.$connect();
            await prisma.apiCallLog.findFirst(); // Test query
        } catch (dbError) {
            console.error('Database Connection Error:', dbError);
            // Still return tweets but log the database error
            return res.status(200).json({
                success: true,
                tweets: transformedTweets,
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
            // Calculate the next refresh time based on the current state
            nextRefreshAvailable: cached && (!apiLog?.lastCallSuccess || tweets.length === 0) ? 
                // If the data is cached and the last call was not successful or there are no tweets, set the next refresh time to 15 minutes after the last call
                new Date(apiLog.lastCallTime.getTime() + 15 * 60 * 1000) : 
                // If the data is not cached or the last call was successful and there are tweets, set the next refresh time to the next day
                apiLog ? addDays(startOfDay(today), 1) : null
        };

        if (rateLimited) {
            response.message = 'Rate limit reached. Showing cached data.';
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