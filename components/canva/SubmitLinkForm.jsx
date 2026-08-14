import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLink, FaPaperPlane, FaTimes } from 'react-icons/fa';

/**
 * Community Link Submission Form
 * Inline form for users to submit Canva Pro invite links.
 */
const SubmitLinkForm = ({ onSubmitted }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!url.trim()) return;

        // Client-side validation
        const canvaPattern = /canva\.com\/brand\/join\?.*token=.+&.*referrer=team-invite/i;
        if (!canvaPattern.test(url.trim())) {
            toast.error('Please enter a valid Canva Pro invite link (must contain canva.com/brand/join with token and referrer=team-invite)');
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch('/api/links/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: url.trim(),
                    authorName: authorName.trim() || undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit link');
            }

            toast.success(
                '🎉 Link submitted! It\'ll appear here once verified by the community.',
                { duration: 6000 },
            );

            setUrl('');
            setAuthorName('');
            setIsOpen(false);

            // Notify parent to refresh links
            if (onSubmitted) onSubmitted();

        } catch (error) {
            toast.error(error.message || 'Failed to submit link');
        } finally {
            setSubmitting(false);
        }
    }, [url, authorName, onSubmitted]);

    return (
        <div className="mb-6">
            <AnimatePresence mode="wait">
                {!isOpen ? (
                    <motion.button
                        key="open-btn"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onClick={() => setIsOpen(true)}
                        className="w-full p-4 rounded-xl border-2 border-dashed 
                            border-purple-300 dark:border-purple-700/50 
                            hover:border-purple-400 dark:hover:border-purple-600
                            bg-purple-50/50 dark:bg-purple-900/10
                            hover:bg-purple-100/50 dark:hover:bg-purple-900/20
                            transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-center gap-3 text-purple-600 dark:text-purple-400">
                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 
                                group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40 transition-colors">
                                <FaLink className="w-4 h-4" />
                            </div>
                            <span className="font-medium">Have a working Canva Pro link? Share it with the community!</span>
                        </div>
                    </motion.button>
                ) : (
                    <motion.form
                        key="form"
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        onSubmit={handleSubmit}
                        className="relative bg-gradient-to-br from-purple-50 to-indigo-50 
                            dark:from-purple-900/20 dark:to-indigo-900/20 
                            p-5 sm:p-6 rounded-xl border border-purple-200/30 dark:border-purple-700/20"
                    >
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 
                                hover:text-gray-600 dark:hover:text-gray-300 
                                hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            <FaTimes className="w-4 h-4" />
                        </button>

                        <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-4 flex items-center gap-2">
                            <FaLink className="w-4 h-4" />
                            Submit a Canva Pro Invite Link
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Canva Invite Link *
                                </label>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://canva.com/brand/join?token=...&referrer=team-invite"
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg text-sm
                                        bg-white dark:bg-gray-800 
                                        border border-gray-200 dark:border-gray-700
                                        focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                                        transition-all duration-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Your Name (optional)
                                </label>
                                <input
                                    type="text"
                                    value={authorName}
                                    onChange={(e) => setAuthorName(e.target.value)}
                                    placeholder="Anonymous"
                                    maxLength={50}
                                    className="w-full px-4 py-2.5 rounded-lg text-sm
                                        bg-white dark:bg-gray-800 
                                        border border-gray-200 dark:border-gray-700
                                        focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                                        transition-all duration-200"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-1">
                                <button
                                    type="submit"
                                    disabled={submitting || !url.trim()}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                                        bg-gradient-to-r from-purple-500 to-indigo-500 text-white
                                        hover:from-purple-600 hover:to-indigo-600
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                                >
                                    <FaPaperPlane className={`w-3.5 h-3.5 ${submitting ? 'animate-pulse' : ''}`} />
                                    {submitting ? 'Submitting...' : 'Submit Link'}
                                </button>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Max 3 submissions per day
                                </span>
                            </div>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
};

SubmitLinkForm.propTypes = {
    onSubmitted: PropTypes.func,
};

export default SubmitLinkForm;
