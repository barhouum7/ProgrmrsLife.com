/**
 * UserReviews — Public social proof component
 *
 * Default export: approved-review carousel
 * Named export:   ActiveUsersBadge — sticky live-count pill above PremiumTeamCard
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaUsers, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const StarRow = ({ rating, size = 'w-4 h-4' }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(n => (
            <FaStar key={n} className={`${size} ${n <= rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />
        ))}
    </div>
);

const ReviewCard = ({ review }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white dark:bg-gray-800/60 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700/30 flex flex-col gap-3 h-full"
    >
        <FaQuoteLeft className="w-5 h-5 text-violet-300 dark:text-violet-700 absolute top-4 right-4" />
        <StarRow rating={review.rating} />
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
            &ldquo;{review.text}&rdquo;
        </p>
        <div className="flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-700/30">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {(review.displayName || 'A')[0].toUpperCase()}
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {review.displayName || 'Anonymous'}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-600 ml-auto">
                {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
        </div>
    </motion.div>
);

/**
 * ActiveUsersBadge
 * Standalone live-count pill. Accepts optional `data` prop from a parent that
 * already fetched /api/premium/stats. Falls back to its own fetch otherwise.
 */
export function ActiveUsersBadge({ data: dataProp }) {
    const [data, setData] = useState(dataProp || { activeCount: 0, totalApproved: 0 });

    useEffect(() => {
        if (dataProp) { setData(dataProp); return; }
        fetch('/api/premium/stats')
            .then(r => r.json())
            .then(d => { if (d.success) setData(d); })
            .catch(() => { });
    }, [dataProp]);

    if (!data.activeCount && !data.totalApproved) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-center gap-3 py-2 px-4"
        >
            {data.activeCount > 0 && (
                <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/30 rounded-full px-5 py-2 shadow-sm">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                    </span>
                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                        {data.activeCount} {data.activeCount === 1 ? 'user' : 'users'} currently enjoying our Exclusive Premium Team
                    </span>
                </div>
            )}
            {data.totalApproved > 0 && (
                <div className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <FaUsers className="w-3.5 h-3.5" />
                    {data.totalApproved}+ total members served
                </div>
            )}
        </motion.div>
    );
}

/** Default export: reviews carousel only (badge is lifted to CanvaLinks as sticky). */
export default function UserReviews() {
    const [data, setData] = useState({ reviews: [] });
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const PER_PAGE = 3;

    useEffect(() => {
        fetch('/api/premium/stats')
            .then(r => r.json())
            .then(d => { if (d.success) setData(d); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const totalPages = Math.ceil((data.reviews?.length || 0) / PER_PAGE);
    const visible = (data.reviews || []).slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

    if (!loading && (!data.reviews || data.reviews.length === 0)) return null;

    return (
        <div>
            {!loading && data.reviews?.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <StarRow rating={5} size="w-3.5 h-3.5" />
                            What members are saying
                        </h3>
                        {totalPages > 1 && (
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 disabled:opacity-30 transition-all"
                                >
                                    <FaChevronLeft className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 disabled:opacity-30 transition-all"
                                >
                                    <FaChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence mode="wait">
                            {visible.map(r => <ReviewCard key={r.id} review={r} />)}
                        </AnimatePresence>
                    </div>

                    {/* Dot indicators */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-1.5 mt-4">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    className={`rounded-full transition-all duration-200 ${i === page ? 'w-4 h-2 bg-violet-500' : 'w-2 h-2 bg-gray-300 dark:bg-gray-600'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
