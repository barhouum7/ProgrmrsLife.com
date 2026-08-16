/**
 * UserFeedbackForm — Review / Feedback / Report submission form
 * 
 * Three modes selectable via tabs:
 *   ⭐ Review    — star rating + name + experience text (shown publicly after approval)
 *   💡 Feedback  — suggestions or general comments
 *   🚨 Report    — problems joining the team (triggers admin email notification)
 * 
 * Rate-limited to 1 submission per userId per type server-side.
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaStar, FaLightbulb, FaExclamationTriangle, FaSpinner, FaCheck, FaPen } from 'react-icons/fa';

const TABS = [
    { id: 'review', label: '⭐ Review', icon: FaStar, placeholder: 'Share your experience...', minLen: 20 },
    { id: 'feedback', label: '💡 Feedback', icon: FaLightbulb, placeholder: 'Suggestions or comments...', minLen: 10 },
    { id: 'report', label: '🚨 Report', icon: FaExclamationTriangle, placeholder: 'Describe the issue you faced...', minLen: 20 },
];

const StarRating = ({ value, onChange }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(n => (
            <button
                key={n}
                type="button"
                onClick={() => onChange(n)}
                className="transition-transform hover:scale-110 focus:outline-none"
            >
                <FaStar className={`w-6 h-6 ${n <= value ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'} transition-colors duration-150`} />
            </button>
        ))}
    </div>
);

export default function UserFeedbackForm({ className = '' }) {
    const [activeTab, setActiveTab] = useState('review');
    const [rating, setRating] = useState(0);
    const [displayName, setDisplayName] = useState('');
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const tab = TABS.find(t => t.id === activeTab);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!text.trim() || text.trim().length < tab.minLen) {
            toast.error(`Please write at least ${tab.minLen} characters.`);
            return;
        }
        if (activeTab === 'review' && rating === 0) {
            toast.error('Please select a star rating.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/premium/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: activeTab,
                    rating: activeTab === 'review' ? rating : undefined,
                    displayName: displayName.trim() || undefined,
                    text: text.trim(),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            toast.success(data.message || 'Submitted! Thank you 🙌');
            setSubmitted(true);
        } catch (err) {
            toast.error(err.message || 'Submission failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }, [activeTab, rating, displayName, text, tab]);

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex flex-col items-center gap-3 py-8 text-center ${className}`}
            >
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <FaCheck className="w-5 h-5 text-green-500" />
                </div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Thank you!</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activeTab === 'review' ? 'Your review will appear after quick approval.' : 'We appreciate your input.'}
                </p>
            </motion.div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Tab switcher */}
            <div className="flex bg-gray-100 dark:bg-gray-800/60 rounded-xl p-1 gap-1">
                {TABS.map(t => (
                    <button
                        key={t.id}
                        onClick={() => { setActiveTab(t.id); setText(''); setRating(0); }}
                        className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200
                            ${activeTab === t.id
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-3"
                    >
                        {/* Star rating — only for reviews */}
                        {activeTab === 'review' && (
                            <div>
                                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block">Your rating *</label>
                                <StarRating value={rating} onChange={setRating} />
                            </div>
                        )}

                        {/* Display name — optional for reviews */}
                        {activeTab === 'review' && (
                            <div>
                                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Display name (optional)</label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={e => setDisplayName(e.target.value)}
                                    placeholder="e.g. Ahmed from Morocco"
                                    maxLength={50}
                                    className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-400/50"
                                />
                            </div>
                        )}

                        {/* Text area */}
                        <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                                {activeTab === 'review' ? 'Your experience *' : activeTab === 'feedback' ? 'Your suggestion *' : 'Describe the problem *'}
                            </label>
                            <textarea
                                value={text}
                                onChange={e => setText(e.target.value)}
                                placeholder={tab.placeholder}
                                rows={3}
                                maxLength={1000}
                                required
                                className="w-full px-3 py-2.5 rounded-lg text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-400/50 resize-none"
                            />
                            <p className="text-[10px] text-gray-400 mt-0.5 text-right">{text.length}/1000</p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white
                        bg-gradient-to-r from-violet-600 to-purple-600
                        hover:from-violet-700 hover:to-purple-700
                        disabled:opacity-50 transition-all duration-200
                        flex items-center justify-center gap-2"
                >
                    {submitting ? <FaSpinner className="w-3.5 h-3.5 animate-spin" /> : <FaPen className="w-3.5 h-3.5" />}
                    {submitting ? 'Submitting...' : `Submit ${activeTab === 'review' ? 'Review' : activeTab === 'feedback' ? 'Feedback' : 'Report'}`}
                </button>
            </form>
        </div>
    );
}
