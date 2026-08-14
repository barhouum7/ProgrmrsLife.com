/**
 * X API Source — Optional pay-per-use fallback
 * 
 * Disabled by default in SourceConfig. Only activated when the user 
 * explicitly enables it. Uses X's pay-per-use endpoint (~$0.005/tweet read).
 * 
 * This is a slimmed-down version of the old lib/twitter.js,
 * adapted to return normalized CanvaLink-compatible objects.
 * 
 * Requires env: TWITTER_BEARER_TOKEN (and optionally TWITTER_2_BEARER_TOKEN, TWITTER_3_BEARER_TOKEN)
 */

import axios from 'axios';

const BEARER_TOKENS = [
    process.env.TWITTER_BEARER_TOKEN,
    process.env.TWITTER_2_BEARER_TOKEN,
    process.env.TWITTER_3_BEARER_TOKEN,
].filter(Boolean);

let currentTokenIndex = 0;

/**
 * Rotate to next bearer token on rate limit
 */
function getNextToken() {
    currentTokenIndex = (currentTokenIndex + 1) % BEARER_TOKENS.length;
    return BEARER_TOKENS[currentTokenIndex];
}

/**
 * Make a request with automatic token rotation on 429
 */
async function makeRequest(url) {
    let attempts = 0;

    while (attempts < BEARER_TOKENS.length) {
        try {
            return await axios.get(url, {
                headers: { Authorization: `Bearer ${BEARER_TOKENS[currentTokenIndex]}` },
                timeout: 15000,
            });
        } catch (error) {
            if (error.response?.status === 429) {
                console.log(`[X API] Token ${currentTokenIndex + 1} rate limited, rotating...`);
                getNextToken();
                attempts++;
                continue;
            }
            throw error;
        }
    }
    throw new Error('All X API tokens are rate limited');
}

/**
 * Fetch Canva invite links from X/Twitter API
 */
export async function fetchFromXApi() {
    if (BEARER_TOKENS.length === 0) {
        console.log('[X API] No bearer tokens configured, skipping.');
        return [];
    }

    const query = encodeURIComponent(
        'url:"canva.com/brand/join" token referrer=team-invite has:links -is:retweet -is:quote -is:reply'
    );

    const url = `https://api.twitter.com/2/tweets/search/recent?query=${query}&tweet.fields=created_at,author_id,entities&expansions=author_id&user.fields=username,name&max_results=10&sort_order=recency`;

    try {
        console.log('[X API] Fetching tweets...');
        const response = await makeRequest(url);

        const tweets = response.data?.data || [];
        const users = response.data?.includes?.users || [];

        console.log(`[X API] Found ${tweets.length} tweets.`);

        return tweets
            .map(tweet => {
                // Extract Canva link from entities
                const canvaUrl = tweet.entities?.urls?.find(u => {
                    const expanded = u.expanded_url?.toLowerCase();
                    return expanded?.includes('canva.com/brand/join')
                        && expanded?.includes('token=')
                        && expanded?.includes('referrer=team-invite');
                })?.expanded_url;

                if (!canvaUrl) return null;

                const author = users.find(u => u.id === tweet.author_id);

                return {
                    url: canvaUrl,
                    source: 'x_api',
                    sourceRef: `https://x.com/${author?.username || 'unknown'}/status/${tweet.id}`,
                    authorName: author?.name || author?.username || 'Unknown',
                    createdAt: tweet.created_at ? new Date(tweet.created_at) : new Date(),
                };
            })
            .filter(Boolean);

    } catch (error) {
        console.error('[X API] Error:', error.response?.status, error.message);

        // 403 = access revoked, don't throw — just return empty
        if (error.response?.status === 403) {
            console.log('[X API] Access revoked (403). Source should be disabled in SourceConfig.');
            return [];
        }

        return [];
    }
}
