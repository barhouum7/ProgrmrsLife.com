import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaCrown, FaCheck, FaSpinner, FaTelegram, FaYoutube, FaFacebook, FaTwitter, FaPuzzlePiece, FaClipboardList, FaEnvelope, FaStar, FaGift } from 'react-icons/fa';
import MiniQuiz from './MiniQuiz';
import FeedbackSurvey from './FeedbackSurvey';
import RewardedAdTask from './RewardedAdTask';
import UserFeedbackForm from './UserFeedbackForm';
import UserReviews from './UserReviews';

const TELEGRAM_LINKS = [
    { label: '@ProgrammersLife01', url: 'https://t.me/ProgrammersLife01' },
    { label: 'Community Group', url: 'https://t.me/+ajOlUL1mUHA3Mzg0' },
];

const YOUTUBE_CHANNEL = 'https://www.youtube.com/channel/UCBuiwdT12ytcmE_NMEPR-Sw?sub_confirmation=1';

// ─── TASK DEFINITIONS ──────────────────────────────────────────────
// required: true = MUST be completed to unlock submit
// required: false = optional bonus tasks
const TASKS = [
    {
        id: 'mini_quiz',
        label: 'Complete a Mini Quiz',
        icon: FaPuzzlePiece,
        color: 'text-amber-600',
        bgColor: 'bg-amber-100 dark:bg-amber-900/30',
        required: true,
        hasInlineUI: true, // rendered inline below the task list
        action: null,
    },
    {
        id: 'survey',
        label: 'Quick Feedback Survey',
        icon: FaClipboardList,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
        required: true,
        hasInlineUI: true,
        action: null,
    },
    {
        id: 'subscribe_youtube',
        label: 'Subscribe on YouTube',
        icon: FaYoutube,
        color: 'text-red-600',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        required: true,
        action: () => {
            window.open(YOUTUBE_CHANNEL, '_blank');
        },
    },
    {
        id: 'share_facebook',
        label: 'Share on Facebook',
        icon: FaFacebook,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        required: false,
        action: () => {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://www.progrmrslife.com/canva-pro-invites')}`, '_blank', 'width=600,height=400');
        },
    },
    {
        id: 'share_twitter',
        label: 'Share on X/Twitter',
        icon: FaTwitter,
        color: 'text-sky-500',
        bgColor: 'bg-sky-100 dark:bg-sky-900/30',
        required: false,
        action: () => {
            const text = encodeURIComponent('Get free Canva Pro access! Check out the latest invite links at @ProgrmrsLife 🎨✨');
            const url = encodeURIComponent('https://www.progrmrslife.com/canva-pro-invites');
            window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
        },
    },
    {
        id: 'join_telegram',
        label: 'Join Telegram Group',
        icon: FaTelegram,
        color: 'text-sky-600',
        bgColor: 'bg-sky-100 dark:bg-sky-900/30',
        required: false,
        action: () => {
            window.open(TELEGRAM_LINKS[1].url, '_blank');
        },
    },
    {
        id: 'rewarded_ad',
        label: 'Watch & Earn Reward',
        icon: FaGift,
        color: 'text-violet-600',
        bgColor: 'bg-violet-100 dark:bg-violet-900/30',
        required: false,
        hasInlineUI: true,
        action: null,
    },
];

const REQUIRED_TASKS = TASKS.filter(t => t.required);
const OPTIONAL_TASKS = TASKS.filter(t => !t.required);

// The rewarded ad is a REQUIRED gate that auto-pops after 3 tasks are done
const AD_GATE_TASK_ID = 'ad_gate';

/**
 * Premium Team Card — Exclusive access section
 * 
 * Three REQUIRED tasks (Quiz, Survey, YouTube) must be completed to unlock.
 * Optional tasks earn bonus goodwill. - Users complete support tasks and submit their email to request
 * access to the private, always-working Canva Pro team.
 */
const PremiumTeamCard = () => {
    const [expanded, setExpanded] = useState(false);
    const [completedTasks, setCompletedTasks] = useState(new Set());
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [requestStatus, setRequestStatus] = useState(null); // null | 'none' | 'pending' | 'tasks_completed' | 'approved' | 'active' | 'expired'
    const [expiresAt, setExpiresAt] = useState(null);
    const [activeInlineTask, setActiveInlineTask] = useState(null); // which inline UI is open
    const [adGateCompleted, setAdGateCompleted] = useState(false); // rewarded ad gate
    const [showAdGate, setShowAdGate] = useState(false); // auto-popup control

    // Check existing request status on mount — cache-busted
    useEffect(() => {
        async function checkStatus() {
            try {
                const res = await fetch(`/api/premium/request?_t=${Date.now()}`);
                const data = await res.json();
                if (data.success) {
                    setRequestStatus(data.status);
                    if (data.expiresAt) setExpiresAt(new Date(data.expiresAt));
                    if (data.email) setEmail(data.email);
                    if (data.tasksCompleted && Array.isArray(data.tasksCompleted)) {
                        setCompletedTasks(new Set(data.tasksCompleted));
                    }
                }
            } catch {
                // Silent fail
            }
        }
        checkStatus();
    }, []);

    // Poll for status updates while pending admin review
    // Allows users to see approval/activation without a page refresh
    useEffect(() => {
        const PENDING_STATUSES = ['tasks_completed', 'approved'];
        if (!PENDING_STATUSES.includes(requestStatus)) return;

        const poll = setInterval(async () => {
            try {
                const res = await fetch(`/api/premium/request?_t=${Date.now()}`);
                const data = await res.json();
                if (data.success && data.status !== requestStatus) {
                    setRequestStatus(data.status);
                    if (data.expiresAt) setExpiresAt(new Date(data.expiresAt));

                    // Notify user of positive status changes
                    if (data.status === 'approved') {
                        toast.success('🎉 Your request has been approved! Canva invite coming soon.', { duration: 8000 });
                    } else if (data.status === 'active') {
                        toast.success('🎨 You now have Canva Pro access! Check your email for the invite.', { duration: 10000 });
                    } else if (data.status === 'rejected') {
                        toast.error('Your request was not approved this time. You may try again.', { duration: 8000 });
                    }
                }
            } catch { /* silent */ }
        }, 30_000); // Poll every 30 seconds while pending

        return () => clearInterval(poll);
    }, [requestStatus]);

    const toggleTask = useCallback((taskId, task) => {
        // If task has inline UI, show it
        if (task.hasInlineUI) {
            setActiveInlineTask(prev => prev === taskId ? null : taskId);
            return;
        }

        // If task has an action, execute it
        if (task.action) task.action();

        setCompletedTasks(prev => {
            const next = new Set(prev);
            if (next.has(taskId)) {
                next.delete(taskId);
            } else {
                next.add(taskId);
            }
            return next;
        });
    }, []);

    // Keeps the quiz result in memory until the form is submitted
    const [pendingQuizResult, setPendingQuizResult] = useState(null);

    const handleInlineComplete = useCallback((taskId, ...args) => {
        setCompletedTasks(prev => {
            const next = new Set(prev);
            next.add(taskId);
            return next;
        });
        setActiveInlineTask(null);
        toast.success('Task completed! ✓');

        // Store quiz score in state — will be sent with the POST on submit
        if (taskId === 'mini_quiz') {
            const [score, total, field] = args;
            if (score !== undefined && total !== undefined) {
                setPendingQuizResult({
                    score,
                    total,
                    field: field || 'general',
                    pct: Math.round((score / total) * 100),
                    completedAt: new Date().toISOString(),
                });
            }
        }
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address.');
            return;
        }

        // Check all required tasks
        const missingRequired = REQUIRED_TASKS.filter(t => !completedTasks.has(t.id));
        if (missingRequired.length > 0) {
            toast.error(`Complete all required tasks first: ${missingRequired.map(t => t.label).join(', ')}`);
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/premium/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim(),
                    tasksCompleted: [...completedTasks],
                    ...(pendingQuizResult ? { quizResult: pendingQuizResult } : {}),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to submit request');
            }

            setRequestStatus(data.status);
            toast.success(data.message || 'Request submitted successfully!', {
                icon: '🎉',
                duration: 6000,
            });

        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    }, [email, completedTasks]);

    const isActive = requestStatus === 'active';
    const isPending = requestStatus === 'tasks_completed' || requestStatus === 'approved' || requestStatus === 'pending';
    const allRequiredDone = REQUIRED_TASKS.every(t => completedTasks.has(t.id));
    // Submit requires: all 3 tasks + rewarded ad gate + valid email
    const canSubmit = allRequiredDone && adGateCompleted && email.includes('@');
    const requiredDoneCount = REQUIRED_TASKS.filter(t => completedTasks.has(t.id)).length;

    // Auto-show rewarded ad gate when all 3 required tasks are done
    useEffect(() => {
        if (allRequiredDone && !adGateCompleted && !showAdGate) {
            // Small delay so user sees the "all done" state before the ad pops
            const timer = setTimeout(() => setShowAdGate(true), 800);
            return () => clearTimeout(timer);
        }
    }, [allRequiredDone, adGateCompleted, showAdGate]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            <div className="relative overflow-hidden rounded-2xl border border-amber-200/30 dark:border-amber-700/20"
                style={{
                    background: 'linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(245,158,11,0.05) 50%, rgba(217,119,6,0.08) 100%)',
                }}
            >
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-400/10 to-transparent rounded-bl-full pointer-events-none"></div>

                <div className="relative p-6 sm:p-8">
                    {/* Header */}
                    <div className="flex items-start sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
                                <FaCrown className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                                    Exclusive Premium Team
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Always-working Canva Pro access — guaranteed
                                </p>
                            </div>
                        </div>
                        {isActive && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Active
                            </span>
                        )}
                    </div>

                    {/* Active Status */}
                    {isActive && (
                        <div className="space-y-4 mb-4">
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200/30 dark:border-green-700/20">
                                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                    <FaCheck className="w-4 h-4" />
                                    <span className="font-medium">Your premium access is active! 🎨</span>
                                </div>
                                <p className="text-sm text-green-600/80 dark:text-green-400/80 mt-1 ml-6">
                                    📧 Check your email for the invite.
                                </p>
                                {expiresAt && (
                                    <p className="text-sm text-green-600/80 dark:text-green-400/80 mt-1 ml-6">
                                        Expires on {expiresAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                )}
                            </div>
                            {/* Feedback/review form for active members */}
                            <div className="bg-white/50 dark:bg-gray-800/30 rounded-xl border border-gray-200/30 dark:border-gray-700/20 p-4">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                                    <FaStar className="w-3.5 h-3.5 text-amber-400" />
                                    Share your experience or report an issue
                                </p>
                                <UserFeedbackForm />
                            </div>
                        </div>
                    )}

                    {/* Pending Status */}
                    {isPending && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200/30 dark:border-amber-700/20 mb-4">
                            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                <FaSpinner className="w-4 h-4 animate-spin" />
                                <span className="font-medium">Your request is being reviewed!</span>
                            </div>
                            <p className="text-sm text-amber-600/80 dark:text-amber-400/80 mt-1 ml-6">
                                We&apos;ll add your email to the team as soon as possible.
                            </p>
                        </div>
                    )}

                    {/* Benefits */}
                    {!isActive && !isPending && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                                {[
                                    { icon: '✅', text: 'Guaranteed working link' },
                                    { icon: '🔒', text: 'Private & exclusive access' },
                                    { icon: '📅', text: '1-month free per turn' },
                                ].map((benefit, i) => (
                                    <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg bg-white/50 dark:bg-gray-800/30 border border-gray-200/20 dark:border-gray-700/20">
                                        <span className="text-lg">{benefit.icon}</span>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{benefit.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA / Expand Button */}
                            {!expanded && (
                                <button
                                    onClick={() => setExpanded(true)}
                                    className="w-full py-3 px-6 rounded-xl font-semibold text-white
                                        bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600
                                        hover:from-amber-600 hover:via-orange-600 hover:to-amber-700
                                        transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20
                                        hover:scale-[1.01] active:scale-[0.99]
                                        flex items-center justify-center gap-2"
                                >
                                    <FaLock className="w-4 h-4" />
                                    Unlock Premium Access
                                </button>
                            )}
                        </>
                    )}

                    {/* Task Panel (Expanded) */}
                    <AnimatePresence>
                        {expanded && !isActive && !isPending && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-5 mt-4"
                            >
                                {/* Required Tasks Section */}
                                <div>
                                    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                        Required Tasks <span className="text-xs font-normal text-amber-600 dark:text-amber-400">({requiredDoneCount}/{REQUIRED_TASKS.length} completed)</span>
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                        {/* Add a tooltip or something to show the estimated time to complete all tasks */}
                                        Complete all 3 required tasks to unlock premium access. {`It'll take you less than 3 minutes to complete all the tasks.`}
                                    </p>

                                    {/* Progress bar */}
                                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
                                        <motion.div
                                            className={`absolute inset-y-0 left-0 rounded-full ${allRequiredDone
                                                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                                : 'bg-gradient-to-r from-amber-400 to-orange-500'
                                                }`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(requiredDoneCount / REQUIRED_TASKS.length) * 100}%` }}
                                            transition={{ duration: 0.4, ease: 'easeOut' }}
                                        />
                                    </div>

                                    {/* Required task buttons */}
                                    <div className="space-y-2">
                                        {REQUIRED_TASKS.map((task) => {
                                            const Icon = task.icon;
                                            const completed = completedTasks.has(task.id);
                                            const isInlineOpen = activeInlineTask === task.id;

                                            return (
                                                <div key={task.id}>
                                                    <button
                                                        onClick={() => toggleTask(task.id, task)}
                                                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all duration-300
                                                            ${completed
                                                                ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700/40 ring-1 ring-green-300/50 dark:ring-green-700/30'
                                                                : isInlineOpen
                                                                    ? 'bg-white dark:bg-gray-800/60 border-amber-300 dark:border-amber-700/40 ring-1 ring-amber-300/50'
                                                                    : 'bg-white/60 dark:bg-gray-800/40 border-gray-200/30 dark:border-gray-700/20 hover:bg-white dark:hover:bg-gray-800/60'
                                                            }
                                                            border hover:shadow-sm`}
                                                    >
                                                        <div className={`p-2 rounded-lg flex-shrink-0 ${completed ? 'bg-green-100 dark:bg-green-900/40' : task.bgColor}`}>
                                                            {completed ? (
                                                                <FaCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                            ) : (
                                                                <Icon className={`w-4 h-4 ${task.color}`} />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <span className={`text-sm font-medium ${completed ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                                {task.label}
                                                            </span>
                                                        </div>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold
                                                            ${completed
                                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                            }`}>
                                                            {completed ? '✓ Done' : 'Required'}
                                                        </span>
                                                    </button>

                                                    {/* Inline UI for Quiz/Survey */}
                                                    <AnimatePresence>
                                                        {isInlineOpen && !completed && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                className="mt-2 ml-2"
                                                            >
                                                                {task.id === 'mini_quiz' && (
                                                                    <MiniQuiz
                                                                        onComplete={(score, total, field) => handleInlineComplete('mini_quiz', score, total, field)}
                                                                        isCompleted={completed}
                                                                    />
                                                                )}
                                                                {task.id === 'survey' && (
                                                                    <FeedbackSurvey
                                                                        onComplete={() => handleInlineComplete('survey')}
                                                                        isCompleted={completed}
                                                                    />
                                                                )}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Optional Tasks Section */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                        Optional — Support us further 💙
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            {OPTIONAL_TASKS.map((task) => {
                                                const Icon = task.icon;
                                                const completed = completedTasks.has(task.id);

                                                return (
                                                    <button
                                                        key={task.id}
                                                        onClick={() => toggleTask(task.id, task)}
                                                        className={`flex items-center gap-2.5 p-3 rounded-xl text-left transition-all duration-300
                                                            ${completed
                                                                ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700/40'
                                                                : 'bg-white/40 dark:bg-gray-800/30 border-gray-200/20 dark:border-gray-700/20 hover:bg-white/70 dark:hover:bg-gray-800/50'
                                                            }
                                                            border`}
                                                    >
                                                        <div className={`p-1.5 rounded-lg flex-shrink-0 ${completed ? 'bg-green-100 dark:bg-green-900/40' : task.bgColor}`}>
                                                            {completed ? (
                                                                <FaCheck className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                                            ) : (
                                                                <Icon className={`w-3.5 h-3.5 ${task.color}`} />
                                                            )}
                                                        </div>
                                                        <span className={`text-xs font-medium ${completed ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                            {task.label}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Inline Rewarded Ad */}
                                        <AnimatePresence>
                                            {activeInlineTask === 'rewarded_ad' && !completedTasks.has('rewarded_ad') && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                >
                                                    <RewardedAdTask
                                                        onReward={() => handleInlineComplete('rewarded_ad')}
                                                        isCompleted={completedTasks.has('rewarded_ad')}
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* ═══ REWARDED AD GATE ═══ */}
                                {/* Auto-pops after 3 required tasks are done — user MUST watch to unlock submit */}
                                <AnimatePresence>
                                    {showAdGate && !adGateCompleted && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                                            className="relative"
                                        >
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold
                                                    bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30">
                                                    <FaGift className="w-3 h-3" />
                                                    Final Step — Watch to Unlock
                                                </span>
                                            </div>
                                            <div className="mt-2 p-[2px] rounded-xl bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-500">
                                                <div className="rounded-[10px] bg-white dark:bg-gray-800 p-1">
                                                    <RewardedAdTask
                                                        onReward={() => {
                                                            setAdGateCompleted(true);
                                                            setShowAdGate(false);
                                                            toast.success('🎉 Ad completed! You can now submit your request.', { duration: 5000 });
                                                        }}
                                                        isCompleted={adGateCompleted}
                                                        minWatchTime={15}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Email + Submit */}
                                <div className="space-y-3 pt-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                            <FaEnvelope className="inline w-3.5 h-3.5 mr-1.5 opacity-60" />
                                            Your Email (we&apos;ll add you to the team with this email)
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            required
                                            disabled={!allRequiredDone || !adGateCompleted}
                                            className="w-full px-4 py-2.5 rounded-lg text-sm
                                                bg-white dark:bg-gray-800 
                                                border border-gray-200 dark:border-gray-700
                                                focus:ring-2 focus:ring-amber-500 focus:border-transparent
                                                placeholder:text-gray-400 dark:placeholder:text-gray-500
                                                disabled:opacity-50 disabled:cursor-not-allowed
                                                transition-all duration-200"
                                        />
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={!canSubmit || submitting}
                                        className="w-full py-3 px-6 rounded-xl font-semibold text-white
                                            bg-gradient-to-r from-amber-500 to-orange-500
                                            hover:from-amber-600 hover:to-orange-600
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                            transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20
                                            flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <FaSpinner className="w-4 h-4 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : !allRequiredDone ? (
                                            <>
                                                <FaLock className="w-4 h-4" />
                                                Complete {REQUIRED_TASKS.length - requiredDoneCount} more required task{REQUIRED_TASKS.length - requiredDoneCount > 1 ? 's' : ''}
                                            </>
                                        ) : !adGateCompleted ? (
                                            <>
                                                <FaLock className="w-4 h-4" />
                                                Watch the ad above to unlock
                                            </>
                                        ) : (
                                            <>
                                                <FaCrown className="w-4 h-4" />
                                                Submit Request
                                            </>
                                        )}
                                    </button>

                                    {!allRequiredDone && (
                                        <p className="text-xs text-center text-amber-600/80 dark:text-amber-400/60">
                                            Complete all 3 required tasks above to unlock
                                        </p>
                                    )}
                                    {allRequiredDone && !adGateCompleted && (
                                        <p className="text-xs text-center text-violet-600/80 dark:text-violet-400/60">
                                            ☝️ Watch the sponsored message above to unlock your submission
                                        </p>
                                    )}
                                </div>

                                {/* Super Package Info */}
                                <div className="bg-gradient-to-r from-violet-50/50 to-purple-50/50 dark:from-violet-900/10 dark:to-purple-900/10 
                                    p-4 rounded-xl border border-violet-200/20 dark:border-violet-700/10">
                                    <h4 className="text-sm font-semibold text-violet-700 dark:text-violet-400 mb-1">
                                        💎 Want 1+ Year Uninterrupted Access?
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                        Contact us for a super package — no monthly renewals needed!
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {TELEGRAM_LINKS.map((link, i) => (
                                            <a
                                                key={i}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                                                    bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400
                                                    hover:bg-violet-200 dark:hover:bg-violet-800/40 transition-colors"
                                            >
                                                <FaTelegram className="w-3.5 h-3.5" />
                                                {link.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default PremiumTeamCard;
