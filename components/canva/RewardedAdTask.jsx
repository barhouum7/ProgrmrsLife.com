import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaCheck, FaGift, FaSpinner, FaEye, FaMousePointer } from 'react-icons/fa';

/**
 * Google Rewarded Ad Component — Dual-mode implementation
 * 
 * Mode 1: Standard AdSense/Ad Unit with smart countdown timer
 *   - Shows an ad slot, requires user to watch for X seconds
 *   - Detects viewport visibility + interaction (click/scroll within ad area)
 *   - Only unlocks reward after both time AND interaction conditions are met
 * 
 * Mode 2: Google Ad Manager (GPT) Rewarded Ad
 *   - Uses googletag.cmd for programmatic rewarded ad delivery
 *   - Triggers reward callback on ad completion event
 *   - Placeholder: set NEXT_PUBLIC_GAM_AD_UNIT_ID when your account is ready
 * 
 * Props:
 *   onReward()    — Called when the user earns the reward
 *   isCompleted   — If already completed, show success state
 *   adSlot        — Optional Google Ad Manager slot ID
 *   minWatchTime  — Seconds the user must watch (default: 15)
 */

const AD_WATCH_TIME = 15; // seconds user must watch the ad
const INTERACTION_REQUIRED = true; // must interact (hover/click) with ad area

const RewardedAdTask = ({ onReward, isCompleted = false, minWatchTime = AD_WATCH_TIME }) => {
    const [phase, setPhase] = useState(isCompleted ? 'completed' : 'idle'); // idle | loading | watching | interacted | completed
    const [countdown, setCountdown] = useState(minWatchTime);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const adContainerRef = useRef(null);
    const timerRef = useRef(null);
    const observerRef = useRef(null);

    // ─── GOOGLE AD MANAGER (GPT) INTEGRATION ────────────────────────
    // This will activate when NEXT_PUBLIC_GAM_AD_UNIT_ID is set
    const gamAdUnitId = typeof window !== 'undefined'
        ? process.env.NEXT_PUBLIC_GAM_AD_UNIT_ID
        : null;

    // ─── INTERSECTION OBSERVER — Track ad visibility ────────────────
    useEffect(() => {
        if (phase !== 'watching') return;

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.5 } // At least 50% visible
        );

        if (adContainerRef.current) {
            observerRef.current.observe(adContainerRef.current);
        }

        return () => observerRef.current?.disconnect();
    }, [phase]);

    // ─── ADSENSE PUSH — push the ad unit when entering watching phase ─
    useEffect(() => {
        if (phase !== 'watching') return;
        if (typeof window === 'undefined') return;
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            // AdSense not loaded — placeholder will remain visible
        }
    }, [phase]);

    // ─── COUNTDOWN TIMER — Only ticks when ad is visible ────────────
    useEffect(() => {
        if (phase !== 'watching' || countdown <= 0) return;

        timerRef.current = setInterval(() => {
            if (isVisible) {
                setCountdown(prev => {
                    const next = prev - 1;
                    if (next <= 0) {
                        clearInterval(timerRef.current);
                        // Check if interaction condition is also met
                        if (hasInteracted || !INTERACTION_REQUIRED) {
                            setPhase('completed');
                        } else {
                            setPhase('interacted'); // waiting for interaction
                        }
                    }
                    return Math.max(next, 0);
                });
            }
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [phase, isVisible, hasInteracted, countdown]);

    // ─── INTERACTION DETECTION ──────────────────────────────────────
    const handleAdInteraction = useCallback(() => {
        if (phase === 'watching' || phase === 'interacted') {
            setHasInteracted(true);
            // If countdown already finished, complete immediately
            if (countdown <= 0) {
                setPhase('completed');
            }
        }
    }, [phase, countdown]);

    // ─── REWARD CALLBACK ────────────────────────────────────────────
    useEffect(() => {
        if (phase === 'completed' && !isCompleted) {
            onReward?.();
        }
    }, [phase, isCompleted, onReward]);

    // ─── START WATCHING ─────────────────────────────────────────────
    const handleStartAd = useCallback(() => {
        setPhase('loading');
        // Simulate ad load time (in production, this would be actual ad load)
        setTimeout(() => {
            setPhase('watching');
            setCountdown(minWatchTime);

            // Try to load Google Ad Manager rewarded ad if configured
            if (gamAdUnitId && typeof window !== 'undefined' && window.googletag) {
                try {
                    window.googletag.cmd.push(() => {
                        const rewardedSlot = window.googletag.defineOutOfPageSlot(
                            gamAdUnitId,
                            window.googletag.enums.OutOfPageFormat.REWARDED
                        );
                        if (rewardedSlot) {
                            rewardedSlot.addService(window.googletag.pubads());
                            window.googletag.pubads().addEventListener('rewardedSlotReady', (evt) => {
                                evt.makeRewardedVisible();
                            });
                            window.googletag.pubads().addEventListener('rewardedSlotGranted', () => {
                                setPhase('completed');
                            });
                            window.googletag.enableServices();
                            window.googletag.display(rewardedSlot);
                        }
                    });
                } catch (err) {
                    console.log('[RewardedAd] GAM not available, using standard ad.');
                }
            }
        }, 800);
    }, [minWatchTime, gamAdUnitId]);

    // ─── COMPLETED STATE ────────────────────────────────────────────
    if (phase === 'completed' || isCompleted) {
        return (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200/30 dark:border-green-700/20">
                <FaGift className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Reward earned! Thank you for your support ✓</span>
            </div>
        );
    }

    // ─── IDLE STATE — Start button ──────────────────────────────────
    if (phase === 'idle') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-xl border bg-white/80 dark:bg-gray-800/80 border-gray-200/30 dark:border-gray-700/20 text-center space-y-3"
            >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                    <FaGift className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100">Support & Earn Rewards</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Watch a short sponsored message ({minWatchTime}s) to complete this task
                    </p>
                </div>
                <button
                    onClick={handleStartAd}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white
                        bg-gradient-to-r from-violet-500 to-purple-600
                        hover:from-violet-600 hover:to-purple-700
                        transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/20 hover:scale-105"
                >
                    <FaPlay className="w-3 h-3" />
                    Watch & Earn
                </button>
            </motion.div>
        );
    }

    // ─── LOADING STATE ──────────────────────────────────────────────
    if (phase === 'loading') {
        return (
            <div className="p-5 rounded-xl border bg-white/80 dark:bg-gray-800/80 border-gray-200/30 dark:border-gray-700/20 text-center space-y-3">
                <FaSpinner className="w-6 h-6 text-violet-500 animate-spin mx-auto" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading sponsored content...</p>
            </div>
        );
    }

    // ─── WATCHING / INTERACTED STATE ────────────────────────────────
    const progressPct = ((minWatchTime - countdown) / minWatchTime) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border bg-white/80 dark:bg-gray-800/80 border-gray-200/30 dark:border-gray-700/20 overflow-hidden"
        >
            {/* Progress Header */}
            <div className="px-4 py-2.5 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-b border-gray-200/30 dark:border-gray-700/20">
                <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                        <FaEye className={`w-3.5 h-3.5 ${isVisible ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            {countdown > 0 ? `Watch for ${countdown}s more` : 'Almost done!'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {hasInteracted && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 font-medium">
                                ✓ Interacted
                            </span>
                        )}
                        <span className="text-xs font-mono text-violet-600 dark:text-violet-400 font-bold">
                            {Math.round(progressPct)}%
                        </span>
                    </div>
                </div>
                <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full"
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                </div>
            </div>

            {/* Ad Container */}
            <div
                ref={adContainerRef}
                onClick={handleAdInteraction}
                onMouseEnter={handleAdInteraction}
                className="relative p-4 min-h-[250px] flex items-center justify-center cursor-pointer"
            >
                {/* Google AdSense slot — renders on top of placeholder */}
                <div className="w-full max-w-[336px] mx-auto relative z-10">
                    {/* Real ad unit — AdSense fills this when loaded */}
                    <ins
                        className="adsbygoogle"
                        style={{ display: 'block', width: '100%', minHeight: '280px' }}
                        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-5021308603136043"}
                        data-ad-slot="3167248456"
                        data-ad-format="auto"
                        data-full-width-responsive="true"
                    />
                </div>

                {/* Fallback placeholder — sits BEHIND the ad (z-0), only visible when AdSense hasn't filled */}
                <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center space-y-2 opacity-50">
                        <div className="w-full max-w-[336px] h-[250px] rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 border-2 border-dashed border-violet-300 dark:border-violet-700 flex flex-col items-center justify-center gap-2">
                            <FaGift className="w-8 h-8 text-violet-400" />
                            <p className="text-sm text-violet-500 dark:text-violet-400 font-medium">Sponsored Content</p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500">Ad loading...</p>
                        </div>
                    </div>
                </div>

                {/* Interaction prompt */}
                {!hasInteracted && countdown <= 5 && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-3 left-0 right-0 text-center"
                    >
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 animate-pulse">
                            <FaMousePointer className="w-3 h-3" />
                            Click or hover over the ad to continue
                        </span>
                    </motion.div>
                )}
            </div>

            {/* Waiting for interaction message */}
            {phase === 'interacted' && !hasInteracted && countdown <= 0 && (
                <div className="px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200/30 dark:border-amber-700/20 text-center">
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                        👆 Please interact with the ad above to complete this task
                    </p>
                </div>
            )}
        </motion.div>
    );
};

/**
 * Load Google AdSense script (call once in _app.js or layout)
 * 
 * Usage in _app.js:
 *   import { loadAdSenseScript } from '../components/canva/RewardedAdTask';
 *   useEffect(() => { loadAdSenseScript(); }, []);
 */
export function loadAdSenseScript() {
    if (typeof window === 'undefined') return;
    if (document.querySelector('script[src*="pagead2.googlesyndication.com"]')) return;

    const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-5021308603136043";
    if (!clientId || clientId.includes('XXXXXXXX')) return; // Skip if not configured

    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
}

/**
 * Load Google Ad Manager (GPT) script for rewarded ads
 * 
 * Usage in _app.js:
 *   import { loadGAMScript } from '../components/canva/RewardedAdTask';
 *   useEffect(() => { loadGAMScript(); }, []);
 */
export function loadGAMScript() {
    if (typeof window === 'undefined') return;
    if (document.querySelector('script[src*="securepubads.g.doubleclick.net"]')) return;
    if (window.googletag) return;

    window.googletag = window.googletag || { cmd: [] };
    const script = document.createElement('script');
    script.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
    script.async = true;
    document.head.appendChild(script);
}

export default RewardedAdTask;
