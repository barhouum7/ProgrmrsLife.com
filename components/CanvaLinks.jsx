import React, { useState, useEffect, useCallback, useRef, useMemo, forwardRef } from 'react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import { format, formatDistanceToNow } from 'date-fns';
import { FaSync, FaExternalLinkAlt, FaClock, FaThumbsUp, FaThumbsDown, FaSpider, FaUsers, FaTwitter, FaHandPointer } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { Tooltip } from 'flowbite-react';
import MockDataIndicator from './MockDataIndicator';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import SubmitLinkForm from './canva/SubmitLinkForm';
import PremiumTeamCard from './canva/PremiumTeamCard';

// ─── SOURCE BADGES ─────────────────────────────────────────────────
const SOURCE_CONFIG = {
    scraper: { label: 'Auto-found', icon: FaSpider, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    community: { label: 'Community', icon: FaUsers, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    x_api: { label: 'Social', icon: FaTwitter, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-900/30' },
    manual: { label: 'Curated', icon: FaHandPointer, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
};


// ─── CONFIG ────────────────────────────────────────────────────────
const POLL_INTERVAL = 120_000; // 2 minutes — cost-effective polling
const FETCH_DEBOUNCE = 2_000;  // Prevent rapid-fire fetches


const CanvaLinks = () => {
    // ── Core state ──────────────────────────────────────────────
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [error, setError] = useState(null);
    const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
    const [cached, setCached] = useState(false);
    const [hasShownCacheToast, setHasShownCacheToast] = useState(false);

    // ── Vote state ──────────────────────────────────────────────
    const [votes, setVotes] = useState({});
    const [voteCounts, setVoteCounts] = useState({});
    const [votingId, setVotingId] = useState(null);
    const [votesLoading, setVotesLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);

    // ── UI state ────────────────────────────────────────────────
    const [revealedLinks, setRevealedLinks] = useState({});
    const [highlightedLinkId, setHighlightedLinkId] = useState(null);
    const { width, height } = useWindowSize();
    const lastFetchRef = useRef(0);


    // ── Filter state ─────────────────────────────────────────────
    const [filterSource, setFilterSource] = useState('all'); // 'all' | 'scraper' | 'community' | 'x_api' | 'manual'
    const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'working' | 'unvoted' | 'broken'

    // ── Sorted links (memoized) ────────────────────────────────
    const sortedLinks = useMemo(() => {
        return [...links].sort((a, b) => {
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
    }, [links, voteCounts]);

    // ── Filtered links (memoized — derived from sortedLinks) ────
    const filteredLinks = useMemo(() => {
        return sortedLinks.filter(link => {
            // Source filter
            if (filterSource !== 'all' && link.source !== filterSource) return false;
            // Status filter
            if (filterStatus !== 'all') {
                const counts = voteCounts[link.id];
                const latestType = counts?.latestVote?.type;
                if (filterStatus === 'working' && latestType !== 'up') return false;
                if (filterStatus === 'broken' && latestType !== 'down') return false;
                if (filterStatus === 'unvoted' && latestType) return false;
            }
            return true;
        });
    }, [sortedLinks, filterSource, filterStatus, voteCounts]);


    // ── Data fetching ───────────────────────────────────────────
    const fetchCanvaLinks = useCallback(async (force = false) => {
        setLoading(true);
        setError(null);

        try {
            if (!navigator.onLine) {
                throw new Error('You are currently offline. Please check your internet connection.');
            }

            const response = await fetch(`/api/links${force ? '?force=true' : ''}`, {
                headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || `Failed to fetch links (Status: ${response.status})`);
            }

            if (!data.success) {
                throw new Error(data.error || 'API returned unsuccessful response');
            }

            setLinks(data.links);
            setLastUpdated(new Date());
            setCached(data.cached || false);

            if (force) {
                toast.success(
                    data.cached
                        ? 'Showing cached links — fresh links loading in background…'
                        : 'Links refreshed successfully!'
                );
            } else if (data.cached && !hasShownCacheToast) {
                toast.success('Showing cached links', {
                    id: 'cache-toast',
                    duration: 3000,
                });
                setHasShownCacheToast(true);
            }

            // Background scrape in progress — auto-reload once it completes
            if (data.scraping && !force) {
                setTimeout(() => {
                    fetchCanvaLinks(true);
                }, 30_000);
            }

            return data;
        } catch (error) {
            console.error('Error fetching Canva links:', error);
            setError(error.message || 'An unexpected error occurred.');

            const isNetworkError = !navigator.onLine || error.name === 'TypeError';
            toast.error(
                isNetworkError
                    ? 'Unable to connect. Please check your internet connection.'
                    : error.message.includes('Rate limit')
                        ? error.message
                        : 'Failed to load links. Please try again later.',
                { duration: 5000, icon: isNetworkError ? '📡' : '❌' }
            );
        } finally {
            setLoading(false);
        }
    }, [hasShownCacheToast]);


    const fetchVoteCounts = useCallback(async () => {
        const now = Date.now();
        if (now - lastFetchRef.current < FETCH_DEBOUNCE) return;
        lastFetchRef.current = now;

        try {
            const [votesResponse, countsResponse] = await Promise.all([
                fetch('/api/votes'),
                fetch('/api/votes/counts')
            ]);

            if (!votesResponse.ok || !countsResponse.ok) return;

            const [votesData, countsData] = await Promise.all([
                votesResponse.json(),
                countsResponse.json()
            ]);

            if (votesData.success && votesData.votes) {
                const formattedVotes = votesData.votes.reduce((acc, vote) => {
                    acc[vote.tweetId] = { type: vote.type, lastVoteTime: vote.createdAt };
                    return acc;
                }, {});
                setVotes(formattedVotes);
                if (votesData.currentUserId) setCurrentUserId(votesData.currentUserId);
            }

            if (countsData.success && countsData.counts) {
                setVoteCounts(countsData.counts);
            }

            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching vote data:', error);
        } finally {
            setVotesLoading(false);
        }
    }, []);


    // ── Effect 1: Initial data load (mount only) ────────────────
    useEffect(() => {
        const loadInitialData = async () => {
            await fetchCanvaLinks();
            await fetchVoteCounts();
        };
        loadInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // ── Effect 2: Vote count polling (120s) + visibility ────────
    useEffect(() => {
        const interval = setInterval(() => {
            if (document.visibilityState === 'visible' && autoRefreshEnabled) {
                fetchVoteCounts();
            }
        }, POLL_INTERVAL);

        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                fetchVoteCounts();
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [fetchVoteCounts, autoRefreshEnabled]);


    // ── Effect 3: Online/offline handling ─────────────────────
    useEffect(() => {
        const handleOnline = () => {
            setError(null);
            toast.success('Back online! Refreshing data...', { icon: '🌐' });
            fetchCanvaLinks();
            fetchVoteCounts();
        };

        const handleOffline = () => {
            setError('You are currently offline. Please check your internet connection.');
            toast.error('You are offline. Please check your connection.', { icon: '📡', duration: 5000 });
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [fetchCanvaLinks, fetchVoteCounts]);


    // ── Handlers ────────────────────────────────────────────────
    const handleRevealLink = (linkId) => {
        if (!revealedLinks[linkId]) {
            setRevealedLinks(prev => ({ ...prev, [linkId]: true }));
            toast.success(
                <div className="space-y-2">
                    <p className="font-medium">Link Revealed! 🎉</p>
                    <p className="text-sm">Please vote if the link is working or broken to help others!</p>
                </div>,
                { duration: 5000 }
            );
        }
    };


    const handleVote = async (linkId, voteType) => {
        if (votingId === linkId) return;

        setVotingId(linkId);
        setHighlightedLinkId(linkId);

        try {
            const isChangingVote = votes[linkId]?.type === voteType;

            const response = await fetch('/api/votes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tweetId: linkId, voteType, action: isChangingVote ? 'remove' : 'add' }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to submit vote');

            setCurrentUserId(data.currentUserId);

            setVotes(isChangingVote
                ? { ...votes, [linkId]: undefined }
                : { ...votes, [linkId]: { type: voteType, lastVoteTime: new Date().toISOString() } }
            );

            setVoteCounts(prev => ({
                ...prev,
                [linkId]: {
                    up: data.counts[linkId]?.up || 0,
                    down: data.counts[linkId]?.down || 0,
                    latestVote: data.counts[linkId]?.latestVote
                }
            }));

            if (isChangingVote) {
                toast.success('Vote removed');
            } else {
                toast.success(
                    voteType === 'up'
                        ? 'Thanks! Link marked as working'
                        : 'Thanks for reporting the broken link'
                );
            }

            setTimeout(() => {
                document.getElementById(`link-${linkId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);

            setTimeout(() => setHighlightedLinkId(null), 2000);
        } catch (error) {
            console.error('Error submitting vote:', error);
            toast.error('Failed to submit vote. Please try again.');
            setHighlightedLinkId(null);
        } finally {
            setVotingId(null);
        }
    };


    const handleManualRefresh = () => {
        if (loading) return;
        toast.loading('Refreshing links...', { id: 'refresh' });
        fetchCanvaLinks(true).then(() => toast.dismiss('refresh'));
    };


    const toggleAutoRefresh = () => {
        setAutoRefreshEnabled(!autoRefreshEnabled);
        toast.success(
            !autoRefreshEnabled
                ? 'Auto-refresh enabled'
                : 'Auto-refresh disabled'
        );
    };


    // ── Helpers ─────────────────────────────────────────────────
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid date';
            return `${format(date, 'MMM d, yyyy')} • ${format(date, 'HH:mm:ss')}`;
        } catch { return 'Invalid date'; }
    };

    const formatRelativeTime = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid date';
            return `${formatDistanceToNow(date)} ago`;
        } catch { return 'Invalid date'; }
    };


    // ── RENDER ──────────────────────────────────────────────────
    return (
        <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-800/40 backdrop-blur-xl rounded-2xl p-8 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 dark:border-gray-700/30">
            <div className="space-y-6 mb-8">
                {/* Banner/Logo Section */}
                {/* <div className="relative w-full h-32 sm:h-40 bg-gradient-to-r from-[#7FE6EA] to-[#BF95F5] rounded-xl">
                    <div className="absolute -top-32 sm:-top-40 inset-0 flex items-center justify-center">
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-gradient-x"></div>
                </div> */}

                <div className="relative flex-none w-full overflow-hidden rounded-xl">
                    <Image
                        src="/imgs/canva-pro-banner.svg"
                        alt="Canva Logo"
                        width={1920}
                        height={1080}
                        layout="responsive"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent dark:from-gray-900/20"></div>
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
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
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
                        <div className="flex items-center gap-3">
                            <h1 className="max-w-[200px] sm:max-w-none text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-500 bg-clip-text text-transparent">
                                Latest Canva PRO Teams
                            </h1>
                            {links.length > 0 && (
                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                                    {links.length} links
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Multi-source aggregated links — updated automatically
                        </p>
                    </div>

                    {/* Controls Section */}
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            {lastUpdated && (
                                <Tooltip content="Time of last data check" style="dark" className="transition duration-700 ease-in-out">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <FaClock className="w-3.5 h-3.5" />
                                        <span>{formatRelativeTime(lastUpdated)}</span>
                                    </div>
                                </Tooltip>
                            )}

                            {cached && (
                                <span className="text-xs text-amber-500 dark:text-amber-400 font-medium">
                                    Showing cached data
                                </span>
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
                                content={loading ? 'Refreshing...' : 'Manually refresh links'}
                                style="dark"
                                className="transition duration-700 ease-in-out"
                            >
                                <button
                                    onClick={handleManualRefresh}
                                    disabled={loading}
                                    className={`
                                        relative p-3 rounded-xl transition-all duration-300
                                        ${loading
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
                        <p className="font-medium">Multi-Source Aggregation</p>
                        <p className="text-sm opacity-75">Links are collected from multiple sources and cached. Fresh auto-fetch runs automatically.</p>
                    </div>
                </div>
            </div>

            {/* Premium Team Section */}
            <PremiumTeamCard />


            <MockDataIndicator />

            {/* ── STICKY FILTER TOOLBAR ─────────────────────────── */}
            {links.length > 0 && (
                <div className="sticky top-16 z-20 -mx-8 px-8 py-3 mb-4
                    bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl
                    border-b border-gray-200/40 dark:border-gray-700/30
                    shadow-sm transition-all duration-300">
                    {/* Source filter row */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {[
                            { key: 'all', label: 'All Sources', count: sortedLinks.length },
                            { key: 'scraper', label: '⚡ Auto-found', count: sortedLinks.filter(l => l.source === 'scraper').length },
                            { key: 'community', label: '👥 Community', count: sortedLinks.filter(l => l.source === 'community').length },
                            { key: 'x_api', label: '📱 Social', count: sortedLinks.filter(l => l.source === 'x_api').length },
                            { key: 'manual', label: '✨ Curated', count: sortedLinks.filter(l => l.source === 'manual').length },
                        ].filter(f => f.key === 'all' || f.count > 0).map(f => (
                            <button key={f.key}
                                onClick={() => setFilterSource(f.key)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200
                                    ${filterSource === f.key
                                        ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/30'
                                        : 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                            >
                                {f.label}
                                {f.count > 0 && <span className={`text-[10px] ${filterSource === f.key ? 'text-violet-200' : 'text-gray-400 dark:text-gray-500'}`}>({f.count})</span>}
                            </button>
                        ))}
                    </div>
                    {/* Status filter row */}
                    <div className="flex flex-wrap gap-1.5">
                        {[
                            { key: 'all', label: 'All', dot: 'bg-gray-400' },
                            { key: 'working', label: '✅ Working', dot: 'bg-green-500' },
                            { key: 'unvoted', label: '⚪ Unvoted', dot: 'bg-gray-400' },
                            { key: 'broken', label: '❌ Broken', dot: 'bg-red-500' },
                        ].map(f => (
                            <button key={f.key}
                                onClick={() => setFilterStatus(f.key)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200
                                    ${filterStatus === f.key
                                        ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/30'
                                        : 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                            >
                                {f.label}
                            </button>
                        ))}
                        {(filterSource !== 'all' || filterStatus !== 'all') && (
                            <button
                                onClick={() => { setFilterSource('all'); setFilterStatus('all'); }}
                                className="px-2.5 py-1 rounded-full text-xs font-medium text-rose-500
                                    bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40
                                    transition-colors duration-200"
                            >
                                × Clear filters
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Stats Summary Row (clickable shortcuts) */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <button onClick={() => setFilterStatus('working')}
                    className={`flex items-center gap-2 text-sm p-2.5 sm:p-3 rounded-xl border transition-all duration-200 text-left
                        ${filterStatus === 'working'
                            ? 'bg-green-200/60 dark:bg-green-800/40 border-green-400/50 dark:border-green-500/40 ring-1 ring-green-500/30'
                            : 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/30 dark:border-green-700/20 hover:bg-green-100/60 dark:hover:bg-green-900/30'}`}>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse flex-shrink-0"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5">
                        <span className="text-green-700 dark:text-green-400 font-semibold text-base">{sortedLinks.filter(t => voteCounts[t.id]?.latestVote?.type === 'up').length}</span>
                        <span className="text-green-600/70 dark:text-green-400/70 text-xs">Working</span>
                    </div>
                </button>
                <button onClick={() => setFilterStatus('broken')}
                    className={`flex items-center gap-2 text-sm p-2.5 sm:p-3 rounded-xl border transition-all duration-200 text-left
                        ${filterStatus === 'broken'
                            ? 'bg-red-200/60 dark:bg-red-800/40 border-red-400/50 dark:border-red-500/40 ring-1 ring-red-500/30'
                            : 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200/30 dark:border-red-700/20 hover:bg-red-100/60 dark:hover:bg-red-900/30'}`}>
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5">
                        <span className="text-red-700 dark:text-red-400 font-semibold text-base">{sortedLinks.filter(t => voteCounts[t.id]?.latestVote?.type === 'down').length}</span>
                        <span className="text-red-600/70 dark:text-red-400/70 text-xs">Broken</span>
                    </div>
                </button>
                <button onClick={() => setFilterStatus('unvoted')}
                    className={`flex items-center gap-2 text-sm p-2.5 sm:p-3 rounded-xl border transition-all duration-200 text-left
                        ${filterStatus === 'unvoted'
                            ? 'bg-gray-200/60 dark:bg-gray-700/40 border-gray-400/50 dark:border-gray-500/40 ring-1 ring-gray-500/30'
                            : 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 border-gray-200/30 dark:border-gray-700/20 hover:bg-gray-100/60 dark:hover:bg-gray-800/60'}`}>
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-400 dark:bg-gray-500 flex-shrink-0"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5">
                        <span className="text-gray-700 dark:text-gray-300 font-semibold text-base">{sortedLinks.filter(t => !voteCounts[t.id]?.latestVote).length}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">Unvoted</span>
                    </div>
                </button>
            </div>


            {/* Community Submit Form */}
            <SubmitLinkForm onSubmitted={() => fetchCanvaLinks(false)} />


            {error ? (
                <div className="relative overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 sm:p-8 border border-red-200/30 dark:border-red-700/20">
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="text-4xl">{!navigator.onLine ? '📡' : '😢'}</div>
                        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
                            {!navigator.onLine ? 'You are offline' : 'Something went wrong'}
                        </h3>
                        <p className="text-sm text-red-600/80 dark:text-red-400/80 max-w-sm">{error}</p>
                        {navigator.onLine && (
                            <button
                                onClick={() => fetchCanvaLinks(true)}
                                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                                    bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400
                                    hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors duration-200"
                            >
                                <FaSync className="w-3 h-3" />
                                Try again
                            </button>
                        )}
                    </div>
                </div>
            ) : loading && links.length === 0 ? (
                <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="relative overflow-hidden bg-gradient-to-r from-white via-white to-white/95 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800/95 rounded-xl p-5 sm:p-6 border border-gray-200/30 dark:border-gray-700/20">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-gray-700/30 to-transparent"></div>
                            <div className="space-y-3">
                                <div className="h-10 bg-gray-100 dark:bg-gray-700/50 rounded-lg"></div>
                                <div className="flex justify-between items-center">
                                    <div className="h-4 bg-gray-100 dark:bg-gray-700/50 rounded w-1/3"></div>
                                    <div className="flex gap-2">
                                        <div className="h-8 w-16 bg-gray-100 dark:bg-gray-700/50 rounded-lg"></div>
                                        <div className="h-8 w-16 bg-gray-100 dark:bg-gray-700/50 rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : links.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                    {filteredLinks.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-3">🔍</div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">No links match your current filters.</p>
                            <button
                                onClick={() => { setFilterSource('all'); setFilterStatus('all'); }}
                                className="px-4 py-2 rounded-xl text-sm font-medium bg-violet-100 dark:bg-violet-900/30
                                    text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900/40 transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredLinks.map((link) => (
                                <LinkCard
                                    key={link.id}
                                    link={link}
                                    revealed={!!revealedLinks[link.id]}
                                    onReveal={handleRevealLink}
                                    vote={votes[link.id]}
                                    voteCount={voteCounts[link.id]}
                                    votingId={votingId}
                                    highlightedLinkId={highlightedLinkId}
                                    onVote={handleVote}
                                    votesLoading={votesLoading}
                                    formatRelativeTime={formatRelativeTime}
                                />
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            ) : (
                <div className="relative overflow-hidden bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-xl p-8 sm:p-12 border border-purple-200/20 dark:border-purple-700/10 text-center">
                    <div className="space-y-4">
                        <div className="text-5xl">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No links available right now</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            New Canva Pro team links are shared daily. Submit your own link above or join our Facebook group to get notified!
                        </p>
                        <a
                            href="https://facebook.com/groups/progrmrslife"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-xl text-sm font-medium
                                bg-gradient-to-r from-blue-500 to-indigo-500 text-white
                                hover:from-blue-600 hover:to-indigo-600 transition-all duration-300
                                hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
                        >
                            Join Facebook Group
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};


// ─── LINK CARD (with forwardRef for AnimatePresence popLayout) ─────
const LinkCard = forwardRef(function LinkCard(
    { link, revealed, onReveal, vote, voteCount, votingId, highlightedLinkId, onVote, votesLoading, formatRelativeTime },
    ref
) {
    const isVoting = votingId === link.id;
    const isHighlighted = highlightedLinkId === link.id;
    const linkUrl = link.url || link.canva_link; // backward compat
    const sourceInfo = SOURCE_CONFIG[link.source] || SOURCE_CONFIG.manual;
    const SourceIcon = sourceInfo.icon;

    return (
        <motion.div
            ref={ref}
            id={`link-${link.id}`}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: 0,
                scale: isHighlighted ? 1.02 : 1,
                transition: { scale: { duration: 0.2, ease: "easeInOut" } }
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 100, damping: 50, mass: 1 }}
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
                ${isVoting ? 'ring-2 ring-offset-2 ring-purple-500 dark:ring-purple-400 dark:ring-offset-gray-900' : ''}
                ${isHighlighted ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400 dark:ring-offset-gray-900 shadow-lg shadow-blue-500/20 dark:shadow-blue-400/20' : ''}
            `}
        >
            {/* Gradient background */}
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

            {/* Top badges row: Source + Status */}
            <div className="absolute -top-2 left-2 sm:left-4 right-2 sm:right-4 flex items-center justify-between">
                {/* Source badge */}
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-medium ${sourceInfo.bg} ${sourceInfo.color}`}>
                    <SourceIcon className="w-3 h-3" />
                    {sourceInfo.label}
                </div>

                {/* Status badge */}
                {vote?.type && (
                    <div className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-medium
                        ${vote.type === 'up'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                    >
                        {vote.type === 'up' ? 'Working' : 'Broken'}
                    </div>
                )}
            </div>


            {/* Card Content */}
            <div className="relative">
                {linkUrl && (
                    <div className="flex flex-col space-y-2 sm:space-y-3">
                        <div className="relative">
                            {/* Link and buttons */}
                            <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 
                                ${!revealed ? 'blur-xl select-none' : ''} 
                                transition-all duration-500 py-0 sm:py-8`}
                            >
                                <div className="relative flex-1 flex items-center">
                                    <svg className="absolute left-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={linkUrl}
                                        readOnly
                                        className="w-full bg-transparent text-sm sm:text-base text-gray-600 
                                        dark:text-gray-300 focus:outline-none cursor-text rounded-lg py-1.5 pl-8 pr-2
                                        border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-inner"
                                        onClick={(e) => { if (revealed) e.target.select(); }}
                                    />
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center justify-end gap-1 sm:gap-2 ml-0 sm:ml-2">
                                    <Tooltip content="Copy link" style="dark">
                                        <button
                                            onClick={() => {
                                                if (revealed) {
                                                    navigator.clipboard.writeText(linkUrl);
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
                                            href={revealed ? linkUrl : '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => { if (!revealed) e.preventDefault(); }}
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
                            {!revealed && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 cursor-pointer"
                                    onClick={() => onReveal(link.id)}
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
                                                {`Don't forget to vote!`}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Confetti */}
                            {revealed && (
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                    <Confetti
                                        width={typeof document !== 'undefined' ? document.querySelector(`#link-${link.id}`)?.offsetWidth || 0 : 0}
                                        height={typeof document !== 'undefined' ? document.querySelector(`#link-${link.id}`)?.offsetHeight || 0 : 0}
                                        recycle={false}
                                        numberOfPieces={100}
                                        gravity={0.3}
                                        onConfettiComplete={(confetti) => confetti.reset()}
                                        style={{ position: 'absolute', inset: 0, zIndex: 50 }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Footer: author + timestamp + votes */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between 
                            gap-2 sm:gap-0 text-xs text-gray-500 dark:text-gray-400 font-medium pt-2 sm:pt-0"
                        >
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                {/* Author + Timestamp */}
                                <div className="flex items-center space-x-2">
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>
                                        {link.authorName && <span className="text-purple-500 dark:text-purple-400">{link.authorName}</span>}
                                        {link.authorName && ' • '}
                                        <span className="text-amber-600 dark:text-amber-400 font-mono">{formatRelativeTime(link.created_at)}</span>
                                    </span>
                                </div>

                                {/* Voting section */}
                                <div className="flex items-center gap-2 sm:border-l border-gray-300 dark:border-gray-600 sm:pl-4">
                                    {votesLoading ? (
                                        <div className="animate-pulse">
                                            <div className="flex items-center space-x-2">
                                                <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700/50 animate-pulse">
                                                    <div className="flex items-center space-x-1.5">
                                                        <div className="w-3.5 h-3.5 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                                        <div className="w-4 h-3.5 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                                    </div>
                                                </div>
                                                <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700/50 animate-pulse">
                                                    <div className="flex items-center space-x-1.5">
                                                        <div className="w-3.5 h-3.5 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                                        <div className="w-4 h-3.5 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                                    </div>
                                                </div>
                                                <div className="hidden sm:block w-32 h-3.5 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse"></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center space-x-2">
                                                <Tooltip
                                                    content={`${voteCount?.up || 0} ${(voteCount?.up || 0) === 1 ? 'user' : 'users'} confirmed working`}
                                                    style="dark"
                                                >
                                                    <button
                                                        onClick={() => onVote(link.id, 'up')}
                                                        disabled={isVoting}
                                                        className={`p-2.5 rounded-lg transition-all duration-300 group relative
                                                            ${isVoting ? 'opacity-50 cursor-progress' : ''}
                                                            ${vote?.type === 'up'
                                                                ? 'bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-800/30 dark:to-emerald-800/30'
                                                                : 'hover:bg-gradient-to-r hover:from-green-100/50 hover:to-emerald-100/50 dark:hover:from-green-800/20 dark:hover:to-emerald-800/20'
                                                            } hover:scale-110 hover:shadow-lg`}
                                                    >
                                                        <div className="flex items-center space-x-1.5">
                                                            <FaThumbsUp className={`w-3.5 h-3.5 transition-colors duration-300
                                                                ${isVoting ? 'animate-pulse' : ''}
                                                                ${vote?.type === 'up'
                                                                    ? 'text-green-600 dark:text-green-400'
                                                                    : 'text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400'
                                                                }`}
                                                            />
                                                            <span className={`text-xs font-medium transition-colors duration-300
                                                                ${vote?.type === 'up'
                                                                    ? 'text-green-600 dark:text-green-400'
                                                                    : 'text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400'
                                                                }`}
                                                            >
                                                                {voteCount?.up ?? 0}
                                                            </span>
                                                        </div>
                                                    </button>
                                                </Tooltip>

                                                <Tooltip
                                                    content={`${voteCount?.down || 0} ${(voteCount?.down || 0) === 1 ? 'user' : 'users'} reported broken`}
                                                    style="dark"
                                                >
                                                    <button
                                                        onClick={() => onVote(link.id, 'down')}
                                                        disabled={isVoting}
                                                        className={`p-2.5 rounded-lg transition-all duration-300 group relative
                                                            ${isVoting ? 'opacity-50 cursor-progress' : ''}
                                                            ${vote?.type === 'down'
                                                                ? 'bg-gradient-to-r from-red-100/80 to-rose-100/80 dark:from-red-800/30 dark:to-rose-800/30'
                                                                : 'hover:bg-gradient-to-r hover:from-red-100/50 hover:to-rose-100/50 dark:hover:from-red-800/20 dark:hover:to-rose-800/20'
                                                            } hover:scale-110 hover:shadow-lg`}
                                                    >
                                                        <div className="flex items-center space-x-1.5">
                                                            <FaThumbsDown className={`w-3.5 h-3.5 transition-colors duration-300
                                                                ${isVoting ? 'animate-pulse' : ''}
                                                                ${vote?.type === 'down'
                                                                    ? 'text-red-600 dark:text-red-400'
                                                                    : 'text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400'
                                                                }`}
                                                            />
                                                            <span className={`text-xs font-medium transition-colors duration-300
                                                                ${vote?.type === 'down'
                                                                    ? 'text-red-600 dark:text-red-400'
                                                                    : 'text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400'
                                                                }`}
                                                            >
                                                                {voteCount?.down ?? 0}
                                                            </span>
                                                        </div>
                                                    </button>
                                                </Tooltip>
                                            </div>

                                            {/* Last vote time indicator */}
                                            {voteCount?.latestVote && (
                                                <div className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 w-full sm:w-auto">
                                                    <Tooltip content={voteCount.latestVote.type === 'up' ? 'Last confirmed working' : 'Last reported broken'} style="dark">
                                                        <div className="flex items-center space-x-1">
                                                            <span>Status:</span>
                                                            <span className={`font-medium ${voteCount.latestVote.type === 'up'
                                                                ? 'text-green-500 dark:text-green-400'
                                                                : 'text-red-500 dark:text-red-400'
                                                                }`}>
                                                                {voteCount.latestVote.type === 'up' ? 'Working' : 'Broken'} • {formatRelativeTime(voteCount.latestVote.time)}
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
    );
});


export default CanvaLinks;