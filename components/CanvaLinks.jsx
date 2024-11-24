import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useState as useReactState } from 'react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

import { format, startOfTomorrow, formatDistanceToNow, addDays } from 'date-fns';
import { FaSync, FaExternalLinkAlt, FaTwitter, FaClock, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { Tooltip } from 'flowbite-react';
import MockDataIndicator from './MockDataIndicator';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

import { wsService } from '../lib/websocket';


const CanvaLinks = () => {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [error, setError] = useState(null);
    const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
    const [nextRefreshTime, setNextRefreshTime] = useState(startOfTomorrow());
    const [dailyCallMade, setDailyCallMade] = useState(false);
    const [highlightedTweetId, setHighlightedTweetId] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [hasShownCacheToast, setHasShownCacheToast] = useState(false);

    useEffect(() => {
        // Get initial user ID
        const fetchInitialUserId = async () => {
            try {
                const response = await fetch('/api/votes');
                const data = await response.json();
                if (data.success && data.currentUserId) {
                    setCurrentUserId(data.currentUserId);
                }
            } catch (error) {
                console.error('Error fetching initial user ID:', error);
            }
        };
    
        fetchInitialUserId();
    }, []);



    const [revealedLinks, setRevealedLinks] = useReactState({});
    const { width, height } = useWindowSize();

    const handleRevealLink = (tweetId) => {
        if (!revealedLinks[tweetId]) {
            setRevealedLinks(prev => ({ ...prev, [tweetId]: true }));
            toast.success(
                <div className="space-y-2">
                    <p className="font-medium">Link Revealed! 🎉</p>
                    <p className="text-sm">Please vote if the link is working or broken to help others!</p>
                </div>,
                { duration: 5000 }
            );
        }
    };



    const [votes, setVotes] = useState({});
    const [votingId, setVotingId] = useState(null);
    const [voteCounts, setVoteCounts] = useState({});


    // A sorting function
    const sortTweetsByWorkingStatus = useCallback((tweetsToSort) => {
        return [...tweetsToSort].sort((a, b) => {
            const aCount = voteCounts[a.id];
            const bCount = voteCounts[b.id];
            
            // First priority: Working votes
            if (aCount?.latestVote?.type === 'up' && bCount?.latestVote?.type !== 'up') return -1;
            if (bCount?.latestVote?.type === 'up' && aCount?.latestVote?.type !== 'up') return 1;
            
            // Second priority: Most recent working votes
            if (aCount?.latestVote?.type === 'up' && bCount?.latestVote?.type === 'up') {
                return new Date(bCount.latestVote.time) - new Date(aCount.latestVote.time);
            }
            
            // Third priority: Broken votes at the bottom
            if (aCount?.latestVote?.type === 'down' && bCount?.latestVote?.type !== 'down') return 1;
            if (bCount?.latestVote?.type === 'down' && aCount?.latestVote?.type !== 'down') return -1;
            
            // Finally, sort by creation date for unvoted items
            return new Date(b.created_at) - new Date(a.created_at);
        });
    }, [voteCounts]);

    // Track sorted tweets
    const [sortedTweets, setSortedTweets] = useState([]);

    // Update the sorted tweets whenever voteCounts change
    useEffect(() => {
        setSortedTweets(sortTweetsByWorkingStatus(tweets));
    }, [tweets, voteCounts, sortTweetsByWorkingStatus]); // Changed from votes to voteCounts



    const [wsConnected, setWsConnected] = useState(false);
    const tweetsRef = useRef(tweets); // Create a ref to store current tweets

    // Update ref when tweets change
    useEffect(() => {
        tweetsRef.current = tweets;
    }, [tweets]);

    useEffect(() => {
        let mounted = true;
        let reconnectTimeout;

        const handleVoteUpdate = (data) => {
            if (!mounted) return;
            
            // console.log('Vote update received:', {
            //     updateUserId: data.userId,
            //     currentUserId: currentUserId,
            //     isOwnVote: data.userId === currentUserId
            // });
            
            // Skip if this is our own vote
            if (data.userId === currentUserId) {
                // console.log('Skipping own vote notification');
                return;
            }
            
            // Update vote counts
            setVoteCounts(prevCounts => ({
                ...prevCounts,
                ...data.counts
            }));
            
            // Show notification for the updated tweet
            const updatedTweet = tweetsRef.current.find(t => t.id === data.updatedTweetId);
            if (updatedTweet && data.counts[data.updatedTweetId]) {
                const newCount = data.counts[data.updatedTweetId];
                const isWorking = newCount.latestVote.type === 'up';
                const totalVotes = (newCount.up || 0) + (newCount.down || 0);
                
                toast(
                    <div className="flex flex-col space-y-1.5">
                        <div className="font-medium flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {isWorking ? (
                                    <span className="flex items-center gap-1.5">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30">
                                            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                        <span>Link confirmed working by another user</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30">
                                            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </span>
                                        <span>Link reported broken by another user</span>
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="flex items-center">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                </span>
                                <span className="text-xs font-semibold text-green-500">LIVE</span>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 break-all max-w-[300px]">
                            {updatedTweet.canva_link}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} total • 
                            {isWorking ? 
                                ` ${newCount.up} working` : 
                                ` ${newCount.down} broken`
                            }
                        </div>
                    </div>,
                    {
                        duration: 6000,
                        position: 'top-right',
                        className: `${isWorking 
                            ? 'bg-green-50 text-green-800 dark:bg-green-900/80 dark:text-green-100' 
                            : 'bg-red-50 text-red-800 dark:bg-red-900/70 dark:text-red-100'
                        } border ${isWorking ? 'border-green-200' : 'border-red-200'}`,
                        id: `vote-${data.updatedTweetId}-${Date.now()}`
                    }
                );
            }
            
            setLastUpdated(new Date(data.lastUpdated));
        };

        const handleConnect = () => {
            if (mounted) {
                // console.log('WebSocket connected');
                setWsConnected(true);
            }
        };

        const handleDisconnect = () => {
            if (mounted) {
                // console.log('WebSocket disconnected');
                setWsConnected(false);
                // Attempt to reconnect after a delay
                reconnectTimeout = setTimeout(initializeWebSocket, 2000);
            }
        };

        const initializeWebSocket = async () => {
            try {
                await wsService.connect();
                
                if (!mounted) return;
    
                wsService.onConnect(handleConnect);
                wsService.onDisconnect(handleDisconnect);
                wsService.subscribe('voteUpdate', handleVoteUpdate);
            } catch (error) {
                console.error('WebSocket initialization error:', error);
                if (mounted) {
                    reconnectTimeout = setTimeout(initializeWebSocket, 2000);
                }
            }
        };
    
        initializeWebSocket();
    
        return () => {
            mounted = false;
            clearTimeout(reconnectTimeout);
            wsService.unsubscribe('voteUpdate', handleVoteUpdate); // Pass specific callback
            wsService.offConnect(handleConnect);
            wsService.offDisconnect(handleDisconnect);
        };
    }, [currentUserId]);


    const [votesLoading, setVotesLoading] = useState(true);

    // First function to fetch initial vote counts when the component mounts
    const fetchInitialData = async () => {
        setVotesLoading(true);
        try {
            const [votesResponse, countsResponse] = await Promise.all([
                fetch('/api/votes', {
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache'
                    }
                }),
                fetch('/api/votes/counts', {
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache'
                    }
                })
            ]);
    
            if (!votesResponse.ok || !countsResponse.ok) {
                throw new Error('Failed to fetch vote data');
            }
    
            const [votesData, countsData] = await Promise.all([
                votesResponse.json(),
                countsResponse.json()
            ]);
    
            if (votesData.success && votesData.votes) {
                const formattedVotes = votesData.votes.reduce((acc, vote) => {
                    acc[vote.tweetId] = {
                        type: vote.type,
                        lastVoteTime: vote.createdAt
                    };
                    return acc;
                }, {});
                setVotes(formattedVotes);
            }
    
            if (countsData.success && countsData.counts) {
                setVoteCounts(countsData.counts);
            }
    
            // Set current user ID if available
            if (votesData.currentUserId) {
                setCurrentUserId(votesData.currentUserId);
            }
    
        } catch (error) {
            console.error('Error fetching initial vote data:', error);
            toast.error('Failed to load vote data. Please refresh the page.');
        } finally {
            setVotesLoading(false);
        }
    };


    useEffect(() => {
        fetchInitialData();
    }, []);

    // Get votes on component mount
    // useEffect(() => {
    //     const fetchVotes = async () => {
    //         try {
    //             console.log('[ CanvaLinks.jsx ] Initial fetch - Fetching user votes...');
    //             const response = await fetch('/api/votes', {
    //                 // Add cache control headers to prevent caching
    //                 headers: {
    //                     'Cache-Control': 'no-cache, no-store, must-revalidate',
    //                     'Pragma': 'no-cache'
    //                 }
    //             });
    //             const data = await response.json();

    //             console.log('[ CanvaLinks.jsx ] Initial fetch - User votes response:', {
    //                 status: response.status,
    //                 ok: response.ok,
    //                 data
    //             });

    //             if (response.ok && data.success && data.votes) {
    //                 const formattedVotes = data.votes.reduce((acc, vote) => {
    //                     acc[vote.tweetId] = {
    //                         type: vote.type,
    //                         lastVoteTime: vote.createdAt
    //                     };
    //                     return acc;
    //                 }, {});

    //                 setVotes(formattedVotes);
    //             } else {
    //                 console.warn('[ CanvaLinks.jsx ] Initial fetch - Failed to fetch user votes:', data);
    //             }
    //         } catch (error) {
    //             console.error('[ CanvaLinks.jsx ] Initial fetch - Error fetching user votes:', error);
    //         }
    //     };

    //     // Immediately invoke the fetch
    //     fetchVotes();
    // }, []);

    
    const handleVote = async (tweetId, voteType) => {
        if (votingId === tweetId) return; // Prevent double voting while processing
        
        setVotingId(tweetId);
        setHighlightedTweetId(tweetId);
        
        try {
            // Check if user is changing their vote
            const isChangingVote = votes[tweetId]?.type === voteType;
            
            const response = await fetch('/api/votes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tweetId,
                    voteType,
                    action: isChangingVote ? 'remove' : 'add'
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit vote');
            }

            setCurrentUserId(data.currentUserId);

            // Update votes state
            const newVotes = isChangingVote
            ? {
                ...votes,
                [tweetId]: undefined // Remove vote if toggling off
            }
            : {
                ...votes,
                [tweetId]: {
                    type: voteType,
                    lastVoteTime: new Date().toISOString(),
                }
            };
            

            setVotes(newVotes);
            
            // Update vote counts based on server response
            setVoteCounts(prev => {
                const newCounts = {
                    ...prev,
                    [tweetId]: {
                        up: data.counts[tweetId]?.up || 0,
                        down: data.counts[tweetId]?.down || 0,
                        latestVote: data.counts[tweetId]?.latestVote
                    }
                };
                return newCounts;
            });

            // Show appropriate toast message
            if (isChangingVote) {
                toast.success('Vote removed');
            } else {
                toast.success(
                    voteType === 'up' 
                        ? 'Thanks! Link marked as working' 
                        : 'Thanks for reporting the broken link'
                );
            }


            // After successful vote, scroll to the tweet after reordering
            setTimeout(() => {
                const tweetElement = document.getElementById(`tweet-${tweetId}`);
                if (tweetElement) {
                    tweetElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center'
                    });
                }
            }, 100); // Small delay to allow for reordering

            // Clear highlight after animation
            setTimeout(() => {
                setHighlightedTweetId(null);
            }, 2000);

        } catch (error) {
            console.error('Error submitting vote:', error);
            toast.error('Failed to submit vote. Please try again.');
            setHighlightedTweetId(null);
        } finally {
            setVotingId(null);
        }
    };


    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Invalid date';
            }
            return `${format(date, 'MMM d, yyyy')} • ${format(date, 'HH:mm:ss')}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };


    const formatRelativeTime = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Invalid date';
            }
            return `${formatDistanceToNow(date)} ago`;
        } catch (error) {
            console.error('Error formatting relative date:', error);
            return 'Invalid date';
        }
    };

    
    const fetchCanvaLinks = useCallback(async (force = false) => {

        setLoading(true);
        setError(null);

        try {
            // First check if we're online
            if (!navigator.onLine) {
                throw new Error('You are currently offline. Please check your internet connection.');
            }

            // console.log('Fetching Canva links...');
            const response = await fetch(`/api/tweets${force ? '?force=true' : ''}`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
            });
            
            const data = await response.json();
        
            if (!response.ok) {
                throw new Error(data.error?.message || `Failed to fetch links (Status: ${response.status})`);
            }
        
            if (!data.success) {
                throw new Error(data.error || 'API returned unsuccessful response');
            }
        
            // console.log(`Fetched ${data.tweets.length} links`);
            setTweets(data.tweets);
            setLastUpdated(new Date());
            setDailyCallMade(data.dailyCallMade);
            setNextRefreshTime(data.nextRefreshAvailable);
        

            // Show success toast if it was a manual refresh
            if (force) {
                toast.success(
                    data.cached ? 
                    `Showing cached links${data.retryAfter ? '. Retry available after ' + format(new Date(data.retryAfter), 'HH:mm:ss') : ''}` : 
                    'Links refreshed successfully!'
                );
            }

            return data;
        
        } catch (error) {
            console.error('Error fetching Canva links:', error);
            setError(error.message || 'An unexpected error occurred. Please try again later.');
            
            
            // Determine if it's a network error
            const isNetworkError = !navigator.onLine || 
            error.name === 'TypeError' || 
            error.message.includes('Failed to fetch');
            
            const errorMessage = isNetworkError
                ? 'Unable to connect. Please check your internet connection.'
                : error.message.includes('Rate limit') 
                    ? error.message
                    : 'Failed to load links. Please try again later.';
            
            toast.error(errorMessage, {
                duration: 5000,
                icon: isNetworkError ? '📡' : '❌'
            });
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        const handleOnline = () => {
            setError(null);
            toast.success('Back online! Refreshing data...', {
                icon: '🌐'
            });
            fetchCanvaLinks();
        };
    
        const handleOffline = () => {
            setError('You are currently offline. Please check your internet connection.');
            toast.error('You are offline. Please check your connection.', {
                icon: '📡',
                duration: 5000
            });
        };
    
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
    
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [fetchCanvaLinks]);



    // Initial fetch and daily refresh setup
    useEffect(() => {
        // Reset daily call status at 12:00 PM UTC
        const resetDailyStatus = () => {
            const now = new Date();
            const today = new Date(now);
            const midday = new Date(today.setUTCHours(12, 0, 0, 0));

            // If it's past midday, set for next day's midday
            if (now > midday) {
                midday.setUTCDate(midday.getUTCDate() + 1);
            }

            const timeUntilMidDay = midday.getTime() - now.getTime();

            setTimeout(() => {
                setDailyCallMade(false);
                setNextRefreshTime(new Date(midday.getTime() + 24 * 60 * 60 * 1000)); // Set for next day's refresh
                if (autoRefreshEnabled) {
                    fetchCanvaLinks();
                }
            }, timeUntilMidDay);
        };

        resetDailyStatus();
        
        // Cleanup
        return () => clearTimeout(resetDailyStatus);
    }, [fetchCanvaLinks, autoRefreshEnabled]);    


    const calculateNextRefresh = useCallback((nextAvailable) => {
        try {
            if (nextAvailable) {
                const date = new Date(nextAvailable);
                if (!isNaN(date.getTime())) {
                    date.setUTCHours(12, 0, 0, 0); // Ensure time is at 12:00 PM UTC
                    setNextRefreshTime(date);
                    return;
                }
            }
            
            // Always set to next day at 12:00 PM UTC
            const next = new Date();
            next.setUTCHours(12, 0, 0, 0); // Ensure time is at 12:00 PM UTC
            next.setUTCDate(next.getUTCDate() + 1); // Ensure it's the next day
            setNextRefreshTime(next);
        } catch (error) {
            console.error('Error calculating next refresh time:', error);
            // Fallback to 24 hours from now at 12:00 PM UTC
            const fallbackDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
            fallbackDate.setUTCHours(12, 0, 0, 0); // Ensure time is at 12:00 PM UTC
            setNextRefreshTime(fallbackDate);
        }
    }, []);



    useEffect(() => {
        // More intelligent refresh interval
        const interval = setInterval(() => {
            if (autoRefreshEnabled && document.visibilityState === 'visible') {
                fetchCanvaLinks();
                calculateNextRefresh();
                toast.success('Links refreshed automatically!', { id: 'auto-refresh' });
            }
        }, 15 * 60 * 1000); // Fetching every 15 minutes

        // Listen for visibility changes
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && autoRefreshEnabled) {
                fetchCanvaLinks();
                calculateNextRefresh();
                toast.success('Links refreshed automatically on visibility change!', { id: 'visibility-refresh' });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [fetchCanvaLinks, autoRefreshEnabled, calculateNextRefresh]);


    // Add auto-refresh toggle to UI
    const toggleAutoRefresh = () => {
        setAutoRefreshEnabled(!autoRefreshEnabled);
        toast.success(
            !autoRefreshEnabled 
            ? 'Auto-refresh enabled - Will refresh daily at midnight' 
            : 'Auto-refresh disabled'
        );
    };



    // Reset the flag after 24 hours
    useEffect(() => {
        const timer = setTimeout(() => {
            setHasShownCacheToast(false);
        }, 24 * 60 * 60 * 1000); // 24 hours

        return () => clearTimeout(timer);
    }, [hasShownCacheToast]);

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchCanvaLinks();
                if (response?.dailyCallMade) {
                    setDailyCallMade(true);
                    calculateNextRefresh(response.nextRefreshAvailable);
                    if (!hasShownCacheToast) {
                        toast.success('Using cached links - Daily API limit reached', {
                            id: 'cache-toast', // This ensures only one toast with this ID exists
                            duration: 5000,
                        });
                        setHasShownCacheToast(true);
                    }
                }
            } catch (error) {
                console.error('Initial fetch error:', error);
                // Don't show error toast here as fetchCanvaLinks already handles that
            }
        };
    
        fetchData();
    }, [calculateNextRefresh, fetchCanvaLinks, hasShownCacheToast]);



    // This is for Admin Testing:
    // const handleManualRefresh = async () => {
    //     if (loading) return;
        
    //     try {
    //         toast.loading('Forcing refresh...', { id: 'refresh' });
    //         const response = await fetch('/api/tweets?force=true&bypass=true', {
    //             headers: {
    //                 'Cache-Control': 'no-cache',
    //                 'Pragma': 'no-cache'
    //             }
    //         });
            
    //         const data = await response.json();
            
    //         if (!response.ok) {
    //             throw new Error(data.error || `Failed to refresh (Status: ${response.status})`);
    //         }
            
    //         if (response.status === 429) {
    //             throw new Error('Rate limit reached. Please try again later.');
    //         }
            
    //         setTweets(data.tweets);
    //         // console.log("[ CanvaLinks.jsx ] Data.tweets: ", data.tweets)
    //         setLastUpdated(new Date());
    //         toast.success('Links refreshed successfully!', { id: 'refresh' });
            
    //     } catch (error) {
    //         console.error('Manual refresh error:', error);
    //         toast.error(error.message, { id: 'refresh' });
    //     }
    // };


    const handleManualRefresh = () => {
        if (loading) return;
        
        if (dailyCallMade) {
            toast.error('Links refresh limit reached. Please try again tomorrow.');
            return;
        }
        
        toast.loading('Refreshing links...', { id: 'refresh' });
        fetchCanvaLinks(true).then(() => {
            toast.dismiss('refresh');
        });
    };
    


    return (
        <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-800/40 backdrop-blur-xl rounded-2xl p-8 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 dark:border-gray-700/30">
            <div className="space-y-6 mb-8">
                {/* Banner/Logo Section */}
                <div className="relative w-full h-32 sm:h-40 bg-gradient-to-r from-[#7FE6EA] to-[#BF95F5] rounded-xl">
                    <div className="absolute -top-32 sm:-top-40 inset-0 flex items-center justify-center">
                        <div className="relative w-[90%] sm:w-3/4 h-[20%] sm:h-3/4">
                            <Image
                                src="/imgs/canva-pro-banner.png"
                                alt="Canva Logo"
                                width={1090}
                                height={1090}
                                className="object-contain w-full h-full"
                                layout='responsive'
                                priority
                            />
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-gradient-x"></div>
                </div>

                <div className="backdrop-blur-xl shadow-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 p-3 sm:p-4 rounded-lg mb-2 border border-amber-100 dark:border-amber-800/30">
                    <div className="flex items-start sm:items-center gap-2 text-amber-700 dark:text-amber-400">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm sm:text-base">Canva teams now have a 100-member limit. Join quickly when new links are shared!</span>
                    </div>
                </div>

                <div className="backdrop-blur-xl shadow-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-3 sm:p-4 rounded-lg mb-2 border border-blue-100 dark:border-blue-800/30">
                    <div className="flex items-start sm:items-center gap-2 text-blue-700 dark:text-blue-400">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="text-sm sm:text-base">Join our Facebook group for updates and support!</span>
                            <a 
                                href="https://facebook.com/groups/progrmrslife" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 transition-colors duration-200"
                            >
                                Join Group
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>


                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    {/* Title Section */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-500 bg-clip-text text-transparent">
                            Latest Canva PRO Teams
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Fresh links updated daily at 12:00 PM UTC
                        </p>
                    </div>

                    {/* Controls Section */}
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            {lastUpdated && (
                                <Tooltip 
                                    content="Time of last data check"
                                    style="dark"
                                    className="transition duration-700 ease-in-out"
                                >
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <FaClock className="w-3.5 h-3.5" />
                                        <span>{formatRelativeTime(lastUpdated)}</span>
                                    </div>
                                </Tooltip>
                            )}
                            
                            {nextRefreshTime && autoRefreshEnabled && (
                                <Tooltip 
                                    content="Next scheduled data refresh"
                                    style="dark"
                                    className="transition duration-700 ease-in-out"
                                >
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        Next refresh in {formatDistanceToNow(nextRefreshTime)}
                                    </span>
                                </Tooltip>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Tooltip 
                                content={autoRefreshEnabled ? 'Disable auto-refresh' : 'Enable auto-refresh'}
                                style="dark"
                                className="transition duration-700 ease-in-out"
                            >
                                <button
                                    onClick={toggleAutoRefresh}
                                    className={`
                                        group relative p-3 rounded-xl transition-all duration-300 
                                        ${autoRefreshEnabled 
                                            ? 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-800/30 dark:to-emerald-800/30 text-green-600 dark:text-green-400' 
                                            : 'bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'}
                                        hover:shadow-lg hover:scale-105
                                    `}
                                >
                                    <FaClock className={autoRefreshEnabled ? loading ? '' : 'animate-[spin_10s_linear_infinite]' : ''} />
                                    <span className={`
                                        absolute -top-1 -right-1 w-3 h-3 rounded-full border-2
                                        ${autoRefreshEnabled 
                                            ? 'bg-green-500 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]' 
                                            : 'bg-gray-400'} 
                                        border-white dark:border-gray-800
                                    `}></span>
                                </button>
                            </Tooltip>
                            
                            <Tooltip 
                                content={
                                    dailyCallMade 
                                        ? 'Daily limit reached. Try again tomorrow' 
                                        : loading 
                                            ? 'Refreshing...' 
                                            : 'Manually refresh links'
                                }
                                style="dark"
                                className="transition duration-700 ease-in-out"
                            >
                                <button
                                    onClick={handleManualRefresh}
                                    disabled={loading}
                                    className={`
                                        relative p-3 rounded-xl transition-all duration-300
                                        ${loading || dailyCallMade
                                            ? 'bg-gray-100 dark:bg-gray-700/50 cursor-not-allowed opacity-50'
                                            : 'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800/30 dark:to-indigo-800/30 text-blue-600 dark:text-blue-400'}
                                        hover:shadow-lg hover:scale-105
                                    `}
                                    aria-label="Refresh links"
                                >
                                    <FaSync className={`${loading ? 'animate-spin' : ''}`} />
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-xl mb-6 border border-amber-100/50 dark:border-amber-800/20">
                <div className="flex items-center gap-3 text-amber-700 dark:text-amber-400">
                    <div className="flex-shrink-0 p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="font-medium">Daily Refresh Schedule</p>
                        <p className="text-sm opacity-75">Links are refreshed once per day. Cached results will be shown between updates.</p>
                    </div>
                </div>
            </div>


            <MockDataIndicator />

            <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3 sm:gap-4 mb-6">
                <div className="flex items-center space-x-2 text-sm bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-green-500/20 dark:bg-green-400/20 ring-2 ring-green-500 dark:ring-green-400"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                        Working Links: {sortedTweets.filter(t => 
                            voteCounts[t.id]?.latestVote?.type === 'up'
                        ).length}
                    </span>
                </div>
                <div className="flex items-center space-x-2 text-sm bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 dark:bg-red-400/20 ring-2 ring-red-500 dark:ring-red-400"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                        Broken Links: {sortedTweets.filter(t => 
                            voteCounts[t.id]?.latestVote?.type === 'down'
                        ).length}
                    </span>
                </div>
                <div className="flex items-center space-x-2 text-sm bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-gray-500/20 dark:bg-gray-400/20 ring-2 ring-gray-500 dark:ring-gray-400"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                        Unverified: {sortedTweets.filter(t => 
                            !voteCounts[t.id]?.latestVote
                        ).length}
                    </span>
                </div>
            </div>


            
            {error ? (
                <div className="text-red-500 dark:text-red-400 text-center py-4 space-y-2">
                    <div className="flex items-center justify-center gap-2">
                        {!navigator.onLine && <span className="text-2xl">📡</span>}
                        <p>{error}</p>
                    </div>
                    {navigator.onLine && (
                        <button
                            onClick={() => fetchCanvaLinks(true)}
                            className="text-sm underline hover:no-underline"
                        >
                            Try again
                        </button>
                    )}
                </div>
            ) : loading && tweets.length === 0 ? (
                <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                ))}
                </div>
                ) : tweets.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                        <AnimatePresence mode="popLayout">
                            {sortedTweets.map((tweet) => (
                                <motion.div
                                    id={`tweet-${tweet.id}`}
                                    key={tweet.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ 
                                        opacity: 1, 
                                        y: 0,
                                        scale: highlightedTweetId === tweet.id ? 1.02 : 1,
                                        transition: {
                                            scale: {
                                                duration: 0.2,
                                                ease: "easeInOut"
                                            }
                                        }
                                    }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 100,
                                        damping: 50,
                                        mass: 1
                                    }}
                                    className={`
                                        group relative bg-gradient-to-r from-white via-white to-white/95 
                                        dark:from-gray-800 dark:via-gray-800 dark:to-gray-800/95 
                                        rounded-xl p-3 sm:p-6 transition-all duration-500 ease-out
                                        hover:scale-[1.02]
                                        before:absolute before:inset-0 before:p-[1px] before:rounded-xl
                                        before:bg-gradient-to-r before:from-purple-500/20 before:via-blue-500/20 before:to-teal-500/20
                                        before:dark:from-purple-400/10 before:dark:via-blue-400/10 before:dark:to-teal-400/10
                                        before:content-[''] before:-z-10
                                        after:absolute after:inset-0 after:p-[1px] after:rounded-xl
                                        after:bg-gradient-to-r after:from-purple-500/5 after:via-blue-500/5 after:to-teal-500/5
                                        after:dark:from-purple-400/5 after:dark:via-blue-400/5 after:dark:to-teal-400/5
                                        after:content-[''] after:-z-20 after:animate-gradient-xy
                                        ${votingId === tweet.id ? 'ring-2 ring-offset-2 ring-purple-500 dark:ring-purple-400 dark:ring-offset-gray-900' : ''}
                                        ${highlightedTweetId === tweet.id ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400 dark:ring-offset-gray-900 shadow-lg shadow-blue-500/20 dark:shadow-blue-400/20' : ''}
                                    `}
                                >
                                    {/* Permanent gradient background with enhanced hover effect */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r 
                                        from-purple-400/20 via-blue-400/20 to-teal-400/20
                                        dark:from-purple-400/10 dark:via-blue-400/10 dark:to-teal-400/10
                                        opacity-100 transition-opacity duration-500"
                                    />
                            
                                    {/* Blur effect */}
                                    <div className="absolute inset-0 rounded-xl transition-opacity duration-500 
                                        opacity-70 blur-xl
                                        bg-gradient-to-r from-purple-400/10 via-blue-400/10 to-teal-400/10
                                        dark:from-purple-400/10 dark:via-blue-400/10 dark:to-teal-400/10"
                                    />


                                    {/* A status badge at the top */}
                                    {votes[tweet.id]?.type && (
                                        <div className={`absolute -top-2 right-2 sm:right-4 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-medium
                                            ${votes[tweet.id]?.type === 'up' ? 
                                                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}
                                        >
                                            {votes[tweet.id]?.type === 'up' ? 'Working' : 'Broken'}
                                        </div>
                                    )}


                                    {/* Card Content Container */}
                                    <div className="relative">
                                        {tweet.canva_link && (
                                            <div className="flex flex-col space-y-2 sm:space-y-3">
                                                <div className="relative">
                                                    {/* Link and buttons container */}
                                                    <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 
                                                        ${!revealedLinks[tweet.id] ? 'blur-xl select-none' : ''} 
                                                    transition-all duration-500 py-0 sm:py-8`}
                                                    >
                                                        <div className="relative flex-1 flex items-center">
                                                            <svg className="absolute left-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                            </svg>
                                                            <input 
                                                                type="text" 
                                                                value={tweet.canva_link}
                                                                readOnly
                                                                className="w-full bg-transparent text-sm sm:text-base text-gray-600 
                                                                dark:text-gray-300 focus:outline-none cursor-text rounded-lg py-1.5 pl-8 pr-2
                                                                border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-inner"
                                                                onClick={(e) => {
                                                                    if (revealedLinks[tweet.id]) {
                                                                        e.target.select();
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                        
                                                        {/* Action buttons */}
                                                        <div className="flex items-center justify-end gap-1 sm:gap-2 ml-0 sm:ml-2">
                                                            <Tooltip content="Copy link" style="dark">
                                                                <button
                                                                    onClick={() => {
                                                                        if (revealedLinks[tweet.id]) {
                                                                            navigator.clipboard.writeText(tweet.canva_link);
                                                                            toast.success('Link copied to clipboard!');
                                                                        }
                                                                    }}
                                                                    className="p-2 sm:p-2.5 rounded-lg transition-all duration-300
                                                                        hover:bg-gradient-to-r hover:from-purple-400/10 hover:via-blue-400/10 hover:to-teal-400/10
                                                                        dark:hover:from-purple-400/5 dark:hover:via-blue-400/5 dark:hover:to-teal-400/5
                                                                        hover:scale-110 hover:shadow-lg group"
                                                                >
                                                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-colors duration-300
                                                                        group-hover:text-purple-500 dark:group-hover:text-purple-400" 
                                                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                                    >
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                                    </svg>
                                                                </button>
                                                            </Tooltip>
                                                            <Tooltip content="Open in new tab" style="dark">
                                                                <a
                                                                    href={revealedLinks[tweet.id] ? tweet.canva_link : '#'}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    onClick={(e) => {
                                                                        if (!revealedLinks[tweet.id]) {
                                                                            e.preventDefault();
                                                                        }
                                                                    }}
                                                                >
                                                                    <button
                                                                        className="p-2.5 rounded-lg transition-all duration-300
                                                                        hover:bg-gradient-to-r hover:from-purple-400/10 hover:via-blue-400/10 hover:to-teal-400/10
                                                                        dark:hover:from-purple-400/5 dark:hover:via-blue-400/5 dark:hover:to-teal-400/5
                                                                        hover:scale-110 hover:shadow-lg group"
                                                                    >
                                                                        <FaExternalLinkAlt className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-colors duration-300
                                                                            group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                                                                    </button>
                                                                </a>
                                                            </Tooltip>
                                                        </div>
                                                    </div>

                                                    {/* Scratch Cover */}
                                                    {!revealedLinks[tweet.id] && (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="absolute inset-0 cursor-pointer"
                                                            onClick={() => handleRevealLink(tweet.id)}
                                                        >
                                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-teal-500/10 
                                                                dark:from-purple-400/5 dark:via-blue-400/5 dark:to-teal-400/5 
                                                                rounded-lg backdrop-blur-md border border-white/20 dark:border-gray-700/30
                                                            flex items-center justify-center p-3 sm:p-4 py-0 sm:py-8"
                                                            >
                                                                <div className="text-center space-y-1.5 sm:space-y-0">
                                                                    <div className="text-xl sm:text-2xl">🎁</div>
                                                                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                                                                        Click to reveal the Canva link
                                                                    </p>
                                                                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                                                        {`Don't forget to vote if it works!`}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    {/* Confetti Effect */}
                                                    {revealedLinks[tweet.id] && (
                                                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                                            <Confetti
                                                                width={document.querySelector(`#tweet-${tweet.id}`)?.offsetWidth || 0}
                                                                height={document.querySelector(`#tweet-${tweet.id}`)?.offsetHeight || 0}
                                                                recycle={false}
                                                                numberOfPieces={100}
                                                                gravity={0.3}
                                                                onConfettiComplete={(confetti) => {
                                                                    confetti.reset();
                                                                }}
                                                                style={{
                                                                    position: 'absolute',
                                                                    inset: 0,
                                                                    zIndex: 50
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between 
                                                    gap-2 sm:gap-0 text-xs text-gray-500 dark:text-gray-400 font-medium pt-2 sm:pt-0"
                                                >
                                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                                        {/* Timestamp */}
                                                        <div className="flex items-center space-x-2">
                                                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span>Posted <span className="text-amber-600 dark:text-amber-400 font-mono">{formatRelativeTime(tweet.created_at)}</span></span>
                                                        </div>


                                                        {/* Voting section */}
                                                        <div className="flex items-center gap-2 sm:border-l border-gray-300 dark:border-gray-600 sm:pl-4">
                                                            {votesLoading ? (
                                                                <div className="animate-pulse">
                                                                    <div className="flex items-center space-x-2">
                                                                        {/* Up vote skeleton */}
                                                                        <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700/50 animate-pulse">
                                                                            <div className="flex items-center space-x-1.5">
                                                                                <div className="w-3.5 h-3.5 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                                                                <div className="w-4 h-3.5 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Down vote skeleton */}
                                                                        <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700/50 animate-pulse">
                                                                            <div className="flex items-center space-x-1.5">
                                                                                <div className="w-3.5 h-3.5 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                                                                <div className="w-4 h-3.5 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Status skeleton */}
                                                                        <div className="hidden sm:block w-32 h-3.5 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse"></div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div className="flex items-center space-x-2">
                                                                        <Tooltip 
                                                                            content={`${voteCounts[tweet.id]?.up || 0} ${
                                                                                voteCounts[tweet.id]?.up === 1 ? 'user' : 'users'
                                                                            } confirmed working`} 
                                                                            style="dark"
                                                                        >
                                                                            <button
                                                                                onClick={() => handleVote(tweet.id, 'up')}
                                                                                disabled={votingId === tweet.id}
                                                                                className={`p-2.5 rounded-lg transition-all duration-300 group relative
                                                                                    ${votingId === tweet.id ? 'opacity-50 cursor-progress' : ''}
                                                                                    ${votes[tweet.id]?.type === 'up'
                                                                                        ? 'bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-800/30 dark:to-emerald-800/30'
                                                                                        : 'hover:bg-gradient-to-r hover:from-green-100/50 hover:to-emerald-100/50 dark:hover:from-green-800/20 dark:hover:to-emerald-800/20'
                                                                                    } hover:scale-110 hover:shadow-lg`}
                                                                            >
                                                                                <div className="flex items-center space-x-1.5">
                                                                                    <FaThumbsUp className={`w-3.5 h-3.5 transition-colors duration-300
                                                                                        ${votingId === tweet.id ? 'animate-pulse' : ''}
                                                                                        ${votes[tweet.id]?.type === 'up'
                                                                                            ? 'text-green-600 dark:text-green-400'
                                                                                            : 'text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400'
                                                                                        }`} 
                                                                                    />
                                                                                    <span className={`text-xs font-medium transition-colors duration-300
                                                                                        ${votes[tweet.id]?.type === 'up'
                                                                                            ? 'text-green-600 dark:text-green-400'
                                                                                            : 'text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400'
                                                                                        }`}
                                                                                    >
                                                                                        {voteCounts[tweet.id]?.up ?? 0}
                                                                                    </span>
                                                                                </div>
                                                                            </button>
                                                                        </Tooltip>

                                                                        <Tooltip 
                                                                            content={`${voteCounts[tweet.id]?.down || 0} ${
                                                                                voteCounts[tweet.id]?.down === 1 ? 'user' : 'users'
                                                                            } reported broken`} 
                                                                            style="dark"
                                                                        >
                                                                            <button
                                                                                onClick={() => handleVote(tweet.id, 'down')}
                                                                                disabled={votingId === tweet.id}
                                                                                className={`p-2.5 rounded-lg transition-all duration-300 group relative
                                                                                    ${votingId === tweet.id ? 'opacity-50 cursor-progress' : ''}
                                                                                    ${votes[tweet.id]?.type === 'down'
                                                                                        ? 'bg-gradient-to-r from-red-100/80 to-rose-100/80 dark:from-red-800/30 dark:to-rose-800/30'
                                                                                        : 'hover:bg-gradient-to-r hover:from-red-100/50 hover:to-rose-100/50 dark:hover:from-red-800/20 dark:hover:to-rose-800/20'
                                                                                    } hover:scale-110 hover:shadow-lg`}
                                                                            >
                                                                                <div className="flex items-center space-x-1.5">
                                                                                    <FaThumbsDown className={`w-3.5 h-3.5 transition-colors duration-300
                                                                                        ${votingId === tweet.id ? 'animate-pulse' : ''}
                                                                                        ${votes[tweet.id]?.type === 'down'
                                                                                            ? 'text-red-600 dark:text-red-400'
                                                                                            : 'text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400'
                                                                                        }`} 
                                                                                    />
                                                                                    <span className={`text-xs font-medium transition-colors duration-300
                                                                                        ${votes[tweet.id]?.type === 'down'
                                                                                            ? 'text-red-600 dark:text-red-400'
                                                                                            : 'text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400'
                                                                                        }`}
                                                                                    >
                                                                                        {voteCounts[tweet.id]?.down ?? 0}
                                                                                    </span>
                                                                                </div>
                                                                            </button>
                                                                        </Tooltip>
                                                                    </div>

                                                                    {/* Last vote time indicator */}
                                                                    {voteCounts[tweet.id]?.latestVote && (
                                                                        <div className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 w-full sm:w-auto">
                                                                            <Tooltip content={voteCounts[tweet.id].latestVote.type === 'up' ? 'Last confirmed working' : 'Last reported broken'} style="dark">
                                                                                <div className="flex items-center space-x-1">
                                                                                    <span>Status:</span>
                                                                                    <span className={`font-medium ${
                                                                                        voteCounts[tweet.id].latestVote.type === 'up' 
                                                                                            ? 'text-green-500 dark:text-green-400' 
                                                                                            : 'text-red-500 dark:text-red-400'
                                                                                    }`}>
                                                                                        {voteCounts[tweet.id].latestVote.type === 'up' ? 'Working' : 'Broken'} • {formatRelativeTime(voteCounts[tweet.id].latestVote.time)}
                                                                                    </span>
                                                                                </div>
                                                                            </Tooltip>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                            </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No Canva links found. Check back later!
                </p>
            )}
        </div>
    );
};

export default CanvaLinks;