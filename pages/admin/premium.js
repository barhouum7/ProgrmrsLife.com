import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import {
    FaCrown, FaUsers, FaCheck, FaTimes, FaSpinner, FaClock,
    FaEnvelope, FaCalendarAlt, FaExclamationTriangle, FaRocket,
    FaBan, FaHistory, FaStar, FaPuzzlePiece, FaClipboardList,
    FaYoutube, FaFacebook, FaTwitter, FaTelegram, FaLock,
    FaChevronDown, FaChevronUp, FaFilter, FaLink, FaShieldAlt,
    FaChartBar, FaPoll
} from 'react-icons/fa';

// Task icons map
const TASK_ICONS = {
    mini_quiz: { icon: FaPuzzlePiece, color: 'text-amber-500', label: 'Quiz' },
    survey: { icon: FaClipboardList, color: 'text-emerald-500', label: 'Survey' },
    subscribe_youtube: { icon: FaYoutube, color: 'text-red-500', label: 'YouTube' },
    share_facebook: { icon: FaFacebook, color: 'text-blue-500', label: 'Facebook' },
    share_twitter: { icon: FaTwitter, color: 'text-sky-500', label: 'Twitter' },
    join_telegram: { icon: FaTelegram, color: 'text-sky-600', label: 'Telegram' },
};

// Status config
const STATUS_CONFIG = {
    tasks_completed: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400', icon: FaClock, label: 'Pending Review' },
    approved: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400', icon: FaCheck, label: 'Approved' },
    active: { color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400', icon: FaRocket, label: 'Active' },
    expired: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-400', icon: FaHistory, label: 'Expired' },
    rejected: { color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400', icon: FaBan, label: 'Rejected' },
    pending: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400', icon: FaClock, label: 'Pending' },
};

export default function PremiumAdminDashboard() {
    const [adminKey, setAdminKey] = useState(() => {
        // Restore key from sessionStorage to avoid re-auth on page reload
        if (typeof window !== 'undefined') return sessionStorage.getItem('adminKey') || '';
        return '';
    });
    const [authenticated, setAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState('premium');

    // Premium requests state
    const [requests, setRequests] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState('tasks_completed');
    const [expandedId, setExpandedId] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [adminNotes, setAdminNotes] = useState({});
    const [durationMonths, setDurationMonths] = useState({});

    // Community links state
    const [communityLinks, setCommunityLinks] = useState([]);
    const [communityLoading, setCommunityLoading] = useState(false);
    const [communityLinkAction, setCommunityLinkAction] = useState(null);

    // Surveys & quizzes state
    const [responses, setResponses] = useState({ surveys: [], quizRequests: [], summary: {} });
    const [responsesLoading, setResponsesLoading] = useState(false);
    const [surveysSubTab, setSurveysSubTab] = useState('surveys'); // 'surveys' | 'quiz' | 'reviews'

    // Reviews/Feedback/Reports state
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewAction, setReviewAction] = useState(null); // reviewId being actioned

    const fetchRequests = useCallback(async (filter = activeFilter) => {
        if (!adminKey) return;
        setLoading(true);
        try {
            const ts = Date.now(); // cache-bust
            const res = await fetch(`/api/premium/admin?key=${encodeURIComponent(adminKey)}&status=${filter}&_t=${ts}`);
            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    setAuthenticated(false);
                    sessionStorage.removeItem('adminKey');
                    toast.error('Invalid or expired admin key');
                    return;
                }
                throw new Error(data.error);
            }

            setRequests(data.requests || []);
            setSummary(data.summary || {});   // summary always covers ALL statuses
            setAuthenticated(true);
            sessionStorage.setItem('adminKey', adminKey);
        } catch (err) {
            toast.error(err.message || 'Failed to fetch');
        } finally {
            setLoading(false);
        }
    }, [adminKey, activeFilter]);

    const fetchCommunityLinks = useCallback(async () => {
        if (!adminKey) return;
        setCommunityLoading(true);
        try {
            const ts = Date.now(); // prevent browser caching stale GET
            const res = await fetch(`/api/links/admin?key=${encodeURIComponent(adminKey)}&status=unverified&_t=${ts}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setCommunityLinks(data.links || []);
        } catch (err) {
            toast.error(err.message || 'Failed to fetch community links');
        } finally {
            setCommunityLoading(false);
        }
    }, [adminKey]);

    const handleCommunityAction = useCallback(async (linkId, action) => {
        // Optimistically remove from list immediately
        setCommunityLinks(prev => prev.filter(l => l.id !== linkId));
        setCommunityLinkAction(`${linkId}_${action}`);
        try {
            const res = await fetch('/api/links/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: adminKey, linkId, action }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            toast.success(`Link ${action === 'verify' ? 'verified ✓' : 'rejected ✗'}`);
        } catch (err) {
            toast.error(err.message);
            // Re-fetch to restore correct state on error
            fetchCommunityLinks();
        } finally {
            setCommunityLinkAction(null);
        }
    }, [adminKey, fetchCommunityLinks]);

    const fetchResponses = useCallback(async () => {
        if (!adminKey) return;
        setResponsesLoading(true);
        try {
            const ts = Date.now();
            const res = await fetch(`/api/premium/responses?key=${encodeURIComponent(adminKey)}&_t=${ts}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setResponses(data);
        } catch (err) {
            toast.error(err.message || 'Failed to fetch responses');
        } finally {
            setResponsesLoading(false);
        }
    }, [adminKey]);

    const fetchReviews = useCallback(async () => {
        if (!adminKey) return;
        setReviewsLoading(true);
        try {
            const ts = Date.now();
            const res = await fetch(`/api/premium/review?key=${encodeURIComponent(adminKey)}&_t=${ts}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setReviews(data.reviews || []);
        } catch (err) {
            toast.error(err.message || 'Failed to fetch reviews');
        } finally {
            setReviewsLoading(false);
        }
    }, [adminKey]);

    const handleReviewAction = useCallback(async (reviewId, action) => {
        setReviewAction(`${reviewId}_${action}`);
        // Optimistic: remove from pending list
        setReviews(prev => action === 'reject'
            ? prev.filter(r => r.id !== reviewId)
            : prev.map(r => r.id === reviewId ? { ...r, approved: true } : r)
        );
        try {
            const res = await fetch('/api/premium/review', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: adminKey, reviewId, action }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            toast.success(action === 'approve' ? 'Review approved ✓' : 'Review removed');
        } catch (err) {
            toast.error(err.message);
            fetchReviews(); // rollback
        } finally {
            setReviewAction(null);
        }
    }, [adminKey, fetchReviews]);

    const handleAuth = useCallback((e) => {
        e.preventDefault();
        fetchRequests();
    }, [fetchRequests]);

    const handleAction = useCallback(async (requestId, action) => {
        setActionLoading(`${requestId}_${action}`);
        try {
            const res = await fetch('/api/premium/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: adminKey,
                    requestId,
                    action,
                    adminNotes: adminNotes[requestId] || '',
                    durationMonths: parseInt(durationMonths[requestId]) || 1,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            toast.success(`Request ${action}d successfully!`);

            // Optimistically update the request in the list
            if (data.request) {
                setRequests(prev => prev.map(r =>
                    r.id === requestId ? { ...r, ...data.request } : r
                ));
                // Remove from list if it no longer matches the active filter
                if (data.request.status !== activeFilter) {
                    setTimeout(() => fetchRequests(), 1500);
                }
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setActionLoading(null);
        }
    }, [adminKey, adminNotes, durationMonths, fetchRequests, activeFilter]);

    useEffect(() => {
        if (authenticated) {
            fetchRequests(activeFilter);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeFilter, authenticated]);

    // Auto-login if adminKey restored from sessionStorage on mount
    useEffect(() => {
        const saved = sessionStorage.getItem('adminKey');
        if (saved && saved === adminKey && !authenticated) {
            fetchRequests();
        }
        // Run only once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Load community links / surveys / reviews when switching tabs
    useEffect(() => {
        if (!authenticated) return;
        if (activeTab === 'links') fetchCommunityLinks();
        if (activeTab === 'surveys') { fetchResponses(); fetchReviews(); }
    }, [activeTab, authenticated, fetchCommunityLinks, fetchResponses, fetchReviews]);

    const formatDate = (date) => {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const totalRequests = Object.values(summary).reduce((a, b) => a + b, 0);

    // ─── AUTH SCREEN ────────────────────────────────────────────────
    if (!authenticated) {
        return (
            <>
                <Head>
                    <title>Premium Admin | ProgrmrsLife</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Head>
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md"
                    >
                        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
                                    <FaCrown className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-white">Premium Admin</h1>
                                <p className="text-sm text-gray-400 mt-1">Manage premium team requests</p>
                            </div>

                            <form onSubmit={handleAuth} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                        <FaLock className="inline w-3.5 h-3.5 mr-1.5 opacity-60" />
                                        Admin Secret Key
                                    </label>
                                    <input
                                        type="password"
                                        value={adminKey}
                                        onChange={(e) => setAdminKey(e.target.value)}
                                        placeholder="Enter admin key..."
                                        required
                                        className="w-full px-4 py-3 rounded-lg text-sm bg-gray-700/50 border border-gray-600/50
                                            text-white placeholder:text-gray-500
                                            focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 rounded-xl font-semibold text-white
                                        bg-gradient-to-r from-amber-500 to-orange-500
                                        hover:from-amber-600 hover:to-orange-600
                                        disabled:opacity-50 transition-all duration-300
                                        flex items-center justify-center gap-2"
                                >
                                    {loading ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaRocket className="w-4 h-4" />}
                                    {loading ? 'Authenticating...' : 'Access Dashboard'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </>
        );
    }

    // ─── DASHBOARD ──────────────────────────────────────────────────
    return (
        <>
            <Head>
                <title>Premium Admin Dashboard | ProgrmrsLife</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <Toaster position="top-right" />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                {/* Header */}
                <div className="border-b border-gray-700/50 bg-gray-800/30 backdrop-blur-xl sticky top-0 z-10">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
                                    <FaCrown className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
                                    <p className="text-xs text-gray-400">{totalRequests} premium requests</p>
                                </div>
                            </div>

                            {/* Tab switcher */}
                            <div className="flex items-center gap-2">
                                <div className="flex bg-gray-700/40 rounded-xl p-1 gap-1">
                                    <button onClick={() => setActiveTab('premium')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                                            ${activeTab === 'premium' ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30' : 'text-gray-400 hover:text-gray-200'}`}
                                    >
                                        <FaCrown className="w-3 h-3" />Premium
                                    </button>
                                    <button onClick={() => setActiveTab('links')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                                            ${activeTab === 'links' ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/30' : 'text-gray-400 hover:text-gray-200'}`}
                                    >
                                        <FaLink className="w-3 h-3" />
                                        Links {communityLinks.length > 0 && (
                                            <span className="ml-0.5 bg-purple-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{communityLinks.length}</span>
                                        )}
                                    </button>
                                    <button onClick={() => setActiveTab('surveys')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                                            ${activeTab === 'surveys' ? 'bg-teal-500/20 text-teal-400 ring-1 ring-teal-500/30' : 'text-gray-400 hover:text-gray-200'}`}
                                    >
                                        <FaChartBar className="w-3 h-3" />
                                        Surveys
                                        {(responses.summary?.surveys || 0) > 0 && (
                                            <span className="ml-0.5 bg-teal-600 text-white text-[10px] rounded-full px-1.5">{responses.summary.surveys}</span>
                                        )}
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        if (activeTab === 'premium') fetchRequests();
                                        else if (activeTab === 'links') fetchCommunityLinks();
                                        else fetchResponses();
                                    }}
                                    disabled={loading || communityLoading || responsesLoading}
                                    className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-700/50 text-gray-300
                                        hover:bg-gray-700 transition-colors flex items-center gap-2"
                                >
                                    {(loading || communityLoading || responsesLoading) ? <FaSpinner className="w-3.5 h-3.5 animate-spin" /> : <FaHistory className="w-3.5 h-3.5" />}
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

                    {/* ── COMMUNITY LINKS TAB ───────────────────────── */}
                    {activeTab === 'links' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-purple-400">
                                <FaLink className="w-4 h-4" />
                                <h2 className="font-semibold">Community Submitted Links</h2>
                                <span className="text-xs text-gray-500">(unverified — pending review)</span>
                            </div>

                            {communityLoading ? (
                                <div className="flex items-center justify-center py-16">
                                    <FaSpinner className="w-6 h-6 text-purple-400 animate-spin" />
                                </div>
                            ) : communityLinks.length === 0 ? (
                                <div className="text-center py-16 text-gray-500">
                                    <FaLink className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                    <p className="font-medium">No pending community links</p>
                                    <p className="text-sm mt-1">All submissions have been reviewed.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {communityLinks.map((link) => (
                                        <div key={link.id}
                                            className="bg-gray-800/40 rounded-xl border border-gray-700/30 p-4"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-purple-300 font-medium mb-1">
                                                        {link.authorName || 'Anonymous'}
                                                        <span className="text-gray-500 font-normal ml-2">
                                                            {formatDate(link.createdAt)}
                                                        </span>
                                                    </p>
                                                    <a
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-sm text-gray-300 hover:text-white break-all transition-colors"
                                                    >
                                                        {link.url.length > 80 ? link.url.slice(0, 80) + '…' : link.url}
                                                    </a>
                                                </div>
                                                <div className="flex flex-col gap-1.5 flex-shrink-0">
                                                    <button
                                                        onClick={() => handleCommunityAction(link.id, 'verify')}
                                                        disabled={communityLinkAction === `${link.id}_verify`}
                                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium
                                                            bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors
                                                            disabled:opacity-50"
                                                    >
                                                        {communityLinkAction === `${link.id}_verify`
                                                            ? <FaSpinner className="w-3 h-3 animate-spin" />
                                                            : <FaCheck className="w-3 h-3" />}
                                                        Verify
                                                    </button>
                                                    <button
                                                        onClick={() => handleCommunityAction(link.id, 'reject')}
                                                        disabled={communityLinkAction === `${link.id}_reject`}
                                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium
                                                            bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors
                                                            disabled:opacity-50"
                                                    >
                                                        {communityLinkAction === `${link.id}_reject`
                                                            ? <FaSpinner className="w-3 h-3 animate-spin" />
                                                            : <FaTimes className="w-3 h-3" />}
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── SURVEYS & QUIZZES TAB ───────────────── */}
                    {activeTab === 'surveys' && (
                        <div className="space-y-4">
                            {/* Top Stats Row */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-gray-800/40 rounded-xl border border-gray-700/30 p-3 text-center">
                                    <p className="text-xs text-gray-500 mb-0.5">Surveys</p>
                                    <p className="text-2xl font-bold text-teal-400">{responses.summary?.surveys || 0}</p>
                                </div>
                                <div className="bg-gray-800/40 rounded-xl border border-gray-700/30 p-3 text-center">
                                    <p className="text-xs text-gray-500 mb-0.5">Quiz Results</p>
                                    <p className="text-2xl font-bold text-amber-400">{responses.summary?.quizzes || 0}</p>
                                </div>
                                <div className="bg-gray-800/40 rounded-xl border border-gray-700/30 p-3 text-center">
                                    <p className="text-xs text-gray-500 mb-0.5">Reviews</p>
                                    <p className="text-2xl font-bold text-violet-400">{reviews.length}</p>
                                </div>
                            </div>

                            {/* Sub-tab switcher */}
                            <div className="flex bg-gray-800/60 rounded-xl p-1 gap-1">
                                {[
                                    { id: 'surveys', label: 'Surveys' },
                                    { id: 'quiz', label: 'Quiz Results' },
                                    { id: 'reviews', label: 'Reviews & Feedback' },
                                ].map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setSurveysSubTab(t.id)}
                                        className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all duration-200
                                            ${surveysSubTab === t.id
                                                ? 'bg-gray-700 text-white shadow-sm'
                                                : 'text-gray-500 hover:text-gray-300'
                                            }
                                            `}
                                    >
                                        <span className={`flex items-center gap-2
                                            ${t.id === 'surveys' && 'text-teal-400'}
                                            ${t.id === 'quiz' && 'text-amber-400'}
                                            ${t.id === 'reviews' && 'text-violet-400'}
                                        `}>
                                            {t.id === 'surveys' && <FaClipboardList className="w-3.5 h-3.5" />}
                                            {t.id === 'quiz' && <FaPuzzlePiece className="w-3.5 h-3.5" />}
                                            {t.id === 'reviews' && "⭐"}
                                            {" "}
                                            {t.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* ── SURVEYS sub-panel ─────────────────── */}
                            {surveysSubTab === 'surveys' && (
                                <div>
                                    {responsesLoading ? (
                                        <div className="flex justify-center py-12">
                                            <FaSpinner className="w-6 h-6 text-teal-400 animate-spin" />
                                        </div>
                                    ) : responses.surveys?.length === 0 ? (
                                        <p className="text-gray-500 text-sm py-8 text-center">No survey responses yet.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {responses.surveys?.map(s => {
                                                const a = typeof s.answers === 'string' ? JSON.parse(s.answers) : s.answers;
                                                return (
                                                    <div key={s.id} className="bg-gray-800/40 rounded-xl border border-gray-700/30 p-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <p className="text-xs text-gray-500">{formatDate(s.createdAt)}</p>
                                                            <div className="flex gap-0.5">
                                                                {[1, 2, 3, 4, 5].map(n => (
                                                                    <FaStar key={n} className={`w-3 h-3 ${n <= (a.rating || 0) ? 'text-amber-400' : 'text-gray-700'}`} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 mb-2">
                                                            {a.discovery && (
                                                                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                                                                    📍 {Array.isArray(a.discovery) ? a.discovery.join(', ') : a.discovery}
                                                                </span>
                                                            )}
                                                            {a.usage && (
                                                                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                                                                    📅 {a.usage}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {a.improve && (
                                                            <p className="text-xs text-gray-400 italic">&ldquo;{a.improve}&rdquo;</p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── QUIZ RESULTS sub-panel ──────────── */}
                            {surveysSubTab === 'quiz' && (
                                <div>
                                    {responsesLoading ? (
                                        <div className="flex justify-center py-12">
                                            <FaSpinner className="w-6 h-6 text-amber-400 animate-spin" />
                                        </div>
                                    ) : responses.quizRequests?.length === 0 ? (
                                        <p className="text-gray-500 text-sm py-8 text-center">No quiz completions yet.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {responses.quizRequests?.map(r => {
                                                const qr = r.quizResult && (typeof r.quizResult === 'string' ? JSON.parse(r.quizResult) : r.quizResult);
                                                const pct = qr ? qr.pct : null;
                                                const passed = pct !== null && pct >= 60;
                                                return (
                                                    <div key={r.id} className="bg-gray-800/40 rounded-xl border border-gray-700/30 p-4">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm text-gray-200 font-medium truncate">{r.email}</p>
                                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.status === 'active' ? 'bg-green-500/20 text-green-400'
                                                                        : r.status === 'approved' ? 'bg-blue-500/20 text-blue-400'
                                                                            : 'bg-gray-600/40 text-gray-400'
                                                                        }`}>{r.status}</span>
                                                                    {qr?.field && (
                                                                        <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                                                                            🎯 {qr.field}
                                                                        </span>
                                                                    )}
                                                                    <span className="text-[10px] text-gray-500">{formatDate(qr?.completedAt || r.createdAt)}</span>
                                                                </div>
                                                            </div>
                                                            {qr ? (
                                                                <div className="text-right flex-shrink-0">
                                                                    <p className={`text-lg font-bold ${passed ? 'text-green-400' : 'text-amber-400'}`}>
                                                                        {qr.score}/{qr.total}
                                                                    </p>
                                                                    <p className="text-[10px] text-gray-500">{pct}% · {passed ? '✓ Passed' : 'Failed'}</p>
                                                                    <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden mt-1 ml-auto">
                                                                        <div
                                                                            className={`h-full rounded-full ${passed
                                                                                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                                                                : 'bg-gradient-to-r from-amber-400 to-orange-500'
                                                                                }`}
                                                                            style={{ width: `${pct}%` }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-[10px] text-gray-600 italic self-center">No score yet</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── REVIEWS sub-panel ─────────────────── */}
                            {surveysSubTab === 'reviews' && (
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="text-xs flex gap-2 items-center">
                                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium">
                                                {reviews.filter(r => !r.approved).length} pending
                                            </span> -
                                            <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-medium">
                                                {reviews.filter(r => r.approved).length} live
                                            </span>
                                        </div>
                                        <button onClick={fetchReviews}
                                            className="text-xs px-2 py-1 rounded-lg bg-gray-700/60 text-gray-400 hover:text-white transition-colors">
                                            {reviewsLoading ? <FaSpinner className="w-3 h-3 animate-spin inline" /> : '↻ Refresh'}
                                        </button>
                                    </div>
                                    {reviewsLoading && reviews.length === 0 ? (
                                        <div className="flex justify-center py-12">
                                            <FaSpinner className="w-5 h-5 text-violet-400 animate-spin" />
                                        </div>
                                    ) : reviews.length === 0 ? (
                                        <p className="text-gray-500 text-sm py-8 text-center">No reviews or feedback yet.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {reviews.map(review => (
                                                <div
                                                    key={review.id}
                                                    className={`rounded-xl border p-4 ${review.approved ? 'bg-green-900/10 border-green-700/20'
                                                        : review.type === 'report' ? 'bg-red-900/10 border-red-700/20'
                                                            : 'bg-gray-800/40 border-gray-700/30'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase ${review.type === 'review' ? 'bg-violet-500/20 text-violet-400'
                                                                    : review.type === 'feedback' ? 'bg-blue-500/20 text-blue-400'
                                                                        : 'bg-red-500/20 text-red-400'
                                                                    }`}>{review.type}</span>
                                                                {review.rating && (
                                                                    <span className="text-amber-400 text-xs">
                                                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                                                    </span>
                                                                )}
                                                                {review.approved && (
                                                                    <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">✓ Public</span>
                                                                )}
                                                                <span className="text-xs text-gray-500 ml-auto">{formatDate(review.createdAt)}</span>
                                                            </div>
                                                            {review.displayName && (
                                                                <p className="text-xs text-gray-400 font-medium mb-0.5">{review.displayName}</p>
                                                            )}
                                                            <p className="text-sm text-gray-300 leading-relaxed">{review.text}</p>
                                                        </div>
                                                        <div className="flex gap-1 flex-col flex-shrink-0">
                                                            {!review.approved && (
                                                                <button
                                                                    onClick={() => handleReviewAction(review.id, 'approve')}
                                                                    disabled={!!reviewAction}
                                                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium
                                                                        bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50 transition-colors"
                                                                >
                                                                    {reviewAction === `${review.id}_approve`
                                                                        ? <FaSpinner className="w-3 h-3 animate-spin" />
                                                                        : <FaCheck className="w-3 h-3" />}
                                                                    Approve
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleReviewAction(review.id, 'reject')}
                                                                disabled={!!reviewAction}
                                                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium
                                                                    bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50 transition-colors"
                                                            >
                                                                {reviewAction === `${review.id}_reject`
                                                                    ? <FaSpinner className="w-3 h-3 animate-spin" />
                                                                    : <FaTimes className="w-3 h-3" />}
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── PREMIUM REQUESTS TAB ───────────────── */}
                    {activeTab === 'premium' && (<>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            {[
                                { key: 'tasks_completed', label: 'Pending', icon: FaClock, color: 'from-amber-500 to-orange-500', textColor: 'text-amber-400' },
                                { key: 'approved', label: 'Approved', icon: FaCheck, color: 'from-blue-500 to-indigo-500', textColor: 'text-blue-400' },
                                { key: 'active', label: 'Active', icon: FaRocket, color: 'from-green-500 to-emerald-500', textColor: 'text-green-400' },
                                { key: 'expired', label: 'Expired', icon: FaHistory, color: 'from-gray-500 to-gray-600', textColor: 'text-gray-400' },
                                { key: 'rejected', label: 'Rejected', icon: FaBan, color: 'from-red-500 to-rose-500', textColor: 'text-red-400' },
                            ].map((stat) => {
                                const Icon = stat.icon;
                                const count = summary[stat.key] || 0;
                                const isActiveFilter = activeFilter === stat.key;

                                return (
                                    <button
                                        key={stat.key}
                                        onClick={() => setActiveFilter(stat.key)}
                                        className={`relative p-4 rounded-xl border transition-all duration-200 text-left
                                            ${isActiveFilter
                                                ? 'bg-gray-700/60 border-amber-500/50 ring-1 ring-amber-500/30'
                                                : 'bg-gray-800/40 border-gray-700/30 hover:bg-gray-800/60'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`p-1.5 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                                <Icon className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <span className="text-xs text-gray-400 font-medium">{stat.label}</span>
                                        </div>
                                        <p className={`text-2xl font-bold ${stat.textColor}`}>{count}</p>
                                    </button>
                                );
                            })}
                        </div>

                        {/* "All" Filter */}
                        <div className="flex items-center gap-2">
                            <FaFilter className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-sm text-gray-400">Showing:</span>
                            <button
                                onClick={() => setActiveFilter('all')}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors
                                    ${activeFilter === 'all'
                                        ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30'
                                        : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                                    }`}
                            >
                                All ({totalRequests})
                            </button>
                        </div>

                        {/* Request List */}
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <FaSpinner className="w-6 h-6 text-amber-500 animate-spin" />
                            </div>
                        ) : requests.length === 0 ? (
                            <div className="text-center py-20 text-gray-500">
                                <FaUsers className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="text-lg font-medium">No requests found</p>
                                <p className="text-sm">Try a different filter or wait for new requests.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {requests.map((req, i) => {
                                        const statusCfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
                                        const StatusIcon = statusCfg.icon;
                                        const isExpanded = expandedId === req.id;
                                        const tasks = Array.isArray(req.tasksCompleted) ? req.tasksCompleted : [];

                                        return (
                                            <motion.div
                                                key={req.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.03 }}
                                                className="bg-gray-800/40 rounded-xl border border-gray-700/30 overflow-hidden"
                                            >
                                                {/* Row Header */}
                                                <button
                                                    onClick={() => setExpandedId(isExpanded ? null : req.id)}
                                                    className="w-full p-4 flex items-center gap-4 text-left hover:bg-gray-800/60 transition-colors"
                                                >
                                                    {/* Avatar */}
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                        {req.email?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-white truncate">{req.email}</p>
                                                        <p className="text-xs text-gray-500">{formatDate(req.createdAt)}</p>
                                                    </div>

                                                    {/* Tasks badges */}
                                                    <div className="hidden sm:flex items-center gap-1">
                                                        {tasks.slice(0, 4).map((taskId) => {
                                                            const taskCfg = TASK_ICONS[taskId];
                                                            if (!taskCfg) return null;
                                                            const TIcon = taskCfg.icon;
                                                            return (
                                                                <div key={taskId} className="p-1.5 rounded-lg bg-gray-700/50" title={taskCfg.label}>
                                                                    <TIcon className={`w-3 h-3 ${taskCfg.color}`} />
                                                                </div>
                                                            );
                                                        })}
                                                        {tasks.length > 4 && (
                                                            <span className="text-xs text-gray-500">+{tasks.length - 4}</span>
                                                        )}
                                                    </div>

                                                    {/* Status */}
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusCfg.color}`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {statusCfg.label}
                                                    </span>

                                                    {/* Chevron */}
                                                    {isExpanded ? (
                                                        <FaChevronUp className="w-3.5 h-3.5 text-gray-500" />
                                                    ) : (
                                                        <FaChevronDown className="w-3.5 h-3.5 text-gray-500" />
                                                    )}
                                                </button>

                                                {/* Expanded Details */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="border-t border-gray-700/30"
                                                        >
                                                            <div className="p-4 space-y-4">
                                                                {/* Details Grid */}
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                    <div className="space-y-2">
                                                                        <div className="flex items-center gap-2 text-sm">
                                                                            <FaEnvelope className="w-3.5 h-3.5 text-gray-500" />
                                                                            <span className="text-gray-400">Email:</span>
                                                                            <span className="text-white font-medium">{req.email}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-sm">
                                                                            <FaCalendarAlt className="w-3.5 h-3.5 text-gray-500" />
                                                                            <span className="text-gray-400">Submitted:</span>
                                                                            <span className="text-gray-300">{formatDate(req.createdAt)}</span>
                                                                        </div>
                                                                        {req.approvedAt && (
                                                                            <div className="flex items-center gap-2 text-sm">
                                                                                <FaCheck className="w-3.5 h-3.5 text-green-500" />
                                                                                <span className="text-gray-400">Approved:</span>
                                                                                <span className="text-green-400">{formatDate(req.approvedAt)}</span>
                                                                            </div>
                                                                        )}
                                                                        {req.expiresAt && (
                                                                            <div className="flex items-center gap-2 text-sm">
                                                                                <FaClock className="w-3.5 h-3.5 text-amber-500" />
                                                                                <span className="text-gray-400">Expires:</span>
                                                                                <span className="text-amber-400">{formatDate(req.expiresAt)}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Tasks completed */}
                                                                    <div>
                                                                        <p className="text-xs text-gray-500 mb-2 font-medium">Tasks Completed ({tasks.length})</p>
                                                                        <div className="flex flex-wrap gap-1.5">
                                                                            {tasks.map((taskId) => {
                                                                                const taskCfg = TASK_ICONS[taskId] || { icon: FaStar, color: 'text-gray-400', label: taskId };
                                                                                const TIcon = taskCfg.icon;
                                                                                return (
                                                                                    <span key={taskId} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-gray-700/50 text-gray-300">
                                                                                        <TIcon className={`w-3 h-3 ${taskCfg.color}`} />
                                                                                        {taskCfg.label}
                                                                                    </span>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Admin Notes */}
                                                                {req.adminNotes && (
                                                                    <div className="p-3 rounded-lg bg-gray-700/30 border border-gray-600/20">
                                                                        <p className="text-xs text-gray-500 mb-1">Admin Notes</p>
                                                                        <p className="text-sm text-gray-300">{req.adminNotes}</p>
                                                                    </div>
                                                                )}

                                                                {/* Action Controls */}
                                                                {(req.status === 'tasks_completed' || req.status === 'approved' || req.status === 'pending') && (
                                                                    <div className="space-y-3 pt-2 border-t border-gray-700/30">
                                                                        {/* Notes input */}
                                                                        <input
                                                                            type="text"
                                                                            value={adminNotes[req.id] || ''}
                                                                            onChange={(e) => setAdminNotes(prev => ({ ...prev, [req.id]: e.target.value }))}
                                                                            placeholder="Admin notes (optional)..."
                                                                            className="w-full px-3 py-2 rounded-lg text-sm bg-gray-700/40 border border-gray-600/30
                                                                                text-white placeholder:text-gray-500 focus:ring-1 focus:ring-amber-500"
                                                                        />

                                                                        <div className="flex flex-wrap items-center gap-2">
                                                                            {/* Approve */}
                                                                            {req.status === 'tasks_completed' && (
                                                                                <button
                                                                                    onClick={() => handleAction(req.id, 'approve')}
                                                                                    disabled={actionLoading === `${req.id}_approve`}
                                                                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
                                                                                        bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors
                                                                                        disabled:opacity-50"
                                                                                >
                                                                                    {actionLoading === `${req.id}_approve` ? <FaSpinner className="w-3 h-3 animate-spin" /> : <FaCheck className="w-3 h-3" />}
                                                                                    Approve
                                                                                </button>
                                                                            )}

                                                                            {/* Activate */}
                                                                            {(req.status === 'tasks_completed' || req.status === 'approved') && (
                                                                                <>
                                                                                    <div className="flex items-center gap-1">
                                                                                        <select
                                                                                            value={durationMonths[req.id] || '1'}
                                                                                            onChange={(e) => setDurationMonths(prev => ({ ...prev, [req.id]: e.target.value }))}
                                                                                            className="px-2 py-2 rounded-lg text-xs bg-gray-700/40 border border-gray-600/30 text-gray-300"
                                                                                        >
                                                                                            <option value="1">1 month</option>
                                                                                            <option value="3">3 months</option>
                                                                                            <option value="6">6 months</option>
                                                                                            <option value="12">12 months</option>
                                                                                        </select>
                                                                                    </div>
                                                                                    <button
                                                                                        onClick={() => handleAction(req.id, 'activate')}
                                                                                        disabled={actionLoading === `${req.id}_activate`}
                                                                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
                                                                                            bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors
                                                                                            disabled:opacity-50"
                                                                                    >
                                                                                        {actionLoading === `${req.id}_activate` ? <FaSpinner className="w-3 h-3 animate-spin" /> : <FaRocket className="w-3 h-3" />}
                                                                                        Activate
                                                                                    </button>
                                                                                </>
                                                                            )}

                                                                            {/* Reject */}
                                                                            <button
                                                                                onClick={() => handleAction(req.id, 'reject')}
                                                                                disabled={actionLoading === `${req.id}_reject`}
                                                                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
                                                                                    bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors
                                                                                    disabled:opacity-50 ml-auto"
                                                                            >
                                                                                {actionLoading === `${req.id}_reject` ? <FaSpinner className="w-3 h-3 animate-spin" /> : <FaTimes className="w-3 h-3" />}
                                                                                Reject
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Expire action for active users */}
                                                                {req.status === 'active' && (
                                                                    <div className="flex items-center gap-2 pt-2 border-t border-gray-700/30">
                                                                        <button
                                                                            onClick={() => handleAction(req.id, 'expire')}
                                                                            disabled={actionLoading === `${req.id}_expire`}
                                                                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
                                                                                bg-gray-600/30 text-gray-400 hover:bg-gray-600/50 transition-colors
                                                                                disabled:opacity-50"
                                                                        >
                                                                            {actionLoading === `${req.id}_expire` ? <FaSpinner className="w-3 h-3 animate-spin" /> : <FaHistory className="w-3 h-3" />}
                                                                            Expire Access
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        )}
                    </>)}
                </div>
            </div>
        </>
    );
}

// Skip the site-wide Layout (navbar/footer) — render as bare full-screen panel
PremiumAdminDashboard.getLayout = (page) => page;
