import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClipboardList, FaCheck, FaStar, FaPaperPlane, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

// ─── SURVEY QUESTIONS ──────────────────────────────────────────────
const SURVEY_STEPS = [
    {
        id: 'rating',
        type: 'stars',
        question: 'How would you rate your experience with our Canva Pro links?',
        subtitle: 'Your feedback helps us improve!',
    },
    {
        id: 'discovery',
        type: 'multi_choice',
        question: 'How did you find ProgrmrsLife?',
        subtitle: 'Select all that apply',
        options: [
            { value: 'google', label: '🔍 Google Search' },
            { value: 'social', label: '📱 Social Media' },
            { value: 'friend', label: '👥 Friend / Referral' },
            { value: 'youtube', label: '🎥 YouTube' },
            { value: 'tiktok', label: '🎵 TikTok' },
            { value: 'reddit', label: '💬 Reddit / Forum' },
            { value: 'other', label: '🌐 Other' },
        ],
    },
    {
        id: 'usage',
        type: 'choice',
        question: 'How often do you use Canva?',
        options: [
            { value: 'daily', label: '📅 Daily' },
            { value: 'weekly', label: '📆 Weekly' },
            { value: 'monthly', label: '🗓️ Monthly' },
            { value: 'rarely', label: '⏳ Rarely' },
            { value: 'new', label: '🆕 Just started' },
        ],
    },
    {
        id: 'improve',
        type: 'text',
        question: 'Any suggestions to improve our service?',
        subtitle: 'Optional — even a few words help!',
        placeholder: 'e.g., "More links daily", "Better UI", "Add more tools"...',
    },
];

/**
 * FeedbackSurvey — A quick 4-step survey with animated transitions
 * 
 * Users complete all steps to mark the survey task as done.
 * Responses are logged (can be sent to analytics/DB later).
 */
const FeedbackSurvey = ({ onComplete, isCompleted = false }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [finished, setFinished] = useState(isCompleted);

    const currentStep = SURVEY_STEPS[step];
    const totalSteps = SURVEY_STEPS.length;
    const progress = ((step + (finished ? 1 : 0)) / totalSteps) * 100;

    const setAnswer = useCallback((id, value) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    }, []);

    // Toggle for multi-choice questions (select/deselect)
    const toggleMultiChoice = useCallback((id, value) => {
        setAnswers(prev => {
            const current = prev[id] || [];
            const next = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [id]: next };
        });
    }, []);

    const handleNext = useCallback(async () => {
        // Validation: non-text questions require an answer
        if (currentStep.type === 'multi_choice') {
            if (!answers[currentStep.id] || answers[currentStep.id].length === 0) return;
        } else if (currentStep.type !== 'text' && !answers[currentStep.id]) {
            return;
        }

        if (step + 1 < totalSteps) {
            setStep(prev => prev + 1);
        } else {
            setFinished(true);

            // Save survey responses to database
            try {
                await fetch('/api/survey/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ answers }),
                });
            } catch (err) {
                console.error('[Survey] Failed to save:', err);
            }

            // Give some time for the finished message to appear before we mark this task as completed:
            setTimeout(() => {
                onComplete?.();
            }, 2000);
        }
    }, [step, totalSteps, answers, currentStep, onComplete]);

    const handleBack = useCallback(() => {
        if (step > 0) setStep(prev => prev - 1);
    }, [step]);

    if (finished) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200/30 dark:border-green-700/20"
            >
                <FaCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Survey completed! Thank you for your feedback ✓</span>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-xl border bg-white/80 dark:bg-gray-800/80 border-gray-200/30 dark:border-gray-700/20 space-y-4"
        >
            {/* Header + Progress */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FaClipboardList className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Step {step + 1} of {totalSteps}
                        </span>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                        {Math.round(progress)}% complete
                    </span>
                </div>
                <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                </div>
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                >
                    <div>
                        <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                            {currentStep.question}
                        </h4>
                        {currentStep.subtitle && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{currentStep.subtitle}</p>
                        )}
                    </div>

                    {/* Star Rating */}
                    {currentStep.type === 'stars' && (
                        <div className="flex items-center gap-1 py-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setAnswer(currentStep.id, star)}
                                    className="p-1 transition-transform duration-200 hover:scale-125"
                                >
                                    <FaStar
                                        className={`w-8 h-8 transition-colors duration-200 ${(answers[currentStep.id] || 0) >= star
                                            ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                                            : 'text-gray-300 dark:text-gray-600'
                                            }`}
                                    />
                                </button>
                            ))}
                            {answers[currentStep.id] && (
                                <motion.span
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="ml-2 text-sm text-amber-600 dark:text-amber-400 font-medium"
                                >
                                    {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][answers[currentStep.id]]}
                                </motion.span>
                            )}
                        </div>
                    )}

                    {/* Single Choice */}
                    {currentStep.type === 'choice' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {currentStep.options.map((opt) => {
                                const isSelected = answers[currentStep.id] === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => setAnswer(currentStep.id, opt.value)}
                                        className={`flex items-center gap-2 p-3 rounded-lg border text-left text-sm transition-all duration-200
                                            ${isSelected
                                                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700/50 ring-1 ring-emerald-300/50 dark:ring-emerald-700/30'
                                                : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200/50 dark:border-gray-600/30 hover:bg-gray-100 dark:hover:bg-gray-700/60'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                                            ${isSelected
                                                ? 'border-emerald-500 bg-emerald-500'
                                                : 'border-gray-300 dark:border-gray-600'
                                            }`}
                                        >
                                            {isSelected && <FaCheck className="w-2.5 h-2.5 text-white" />}
                                        </div>
                                        <span className="text-gray-700 dark:text-gray-300">{opt.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Multi Choice (select multiple) */}
                    {currentStep.type === 'multi_choice' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {currentStep.options.map((opt) => {
                                const selectedArr = answers[currentStep.id] || [];
                                const isSelected = selectedArr.includes(opt.value);
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => toggleMultiChoice(currentStep.id, opt.value)}
                                        className={`flex items-center gap-2 p-3 rounded-lg border text-left text-sm transition-all duration-200
                                            ${isSelected
                                                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700/50 ring-1 ring-emerald-300/50 dark:ring-emerald-700/30'
                                                : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200/50 dark:border-gray-600/30 hover:bg-gray-100 dark:hover:bg-gray-700/60'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors
                                            ${isSelected
                                                ? 'border-emerald-500 bg-emerald-500'
                                                : 'border-gray-300 dark:border-gray-600'
                                            }`}
                                        >
                                            {isSelected && <FaCheck className="w-2.5 h-2.5 text-white" />}
                                        </div>
                                        <span className="text-gray-700 dark:text-gray-300">{opt.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Text Input */}
                    {currentStep.type === 'text' && (
                        <textarea
                            value={answers[currentStep.id] || ''}
                            onChange={(e) => setAnswer(currentStep.id, e.target.value)}
                            placeholder={currentStep.placeholder}
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg text-sm resize-none
                                bg-gray-50 dark:bg-gray-700/40
                                border border-gray-200/50 dark:border-gray-600/30
                                focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                                placeholder:text-gray-400 dark:placeholder:text-gray-500
                                transition-all duration-200"
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-1">
                <button
                    onClick={handleBack}
                    disabled={step === 0}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                        ${step === 0
                            ? 'opacity-0 pointer-events-none'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                        }`}
                >
                    <FaArrowLeft className="w-3 h-3" />
                    Back
                </button>

                <button
                    onClick={handleNext}
                    disabled={
                        currentStep.type === 'multi_choice'
                            ? (!answers[currentStep.id] || answers[currentStep.id].length === 0)
                            : (currentStep.type !== 'text' && !answers[currentStep.id])
                    }
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                        ${(currentStep.type === 'text' || answers[currentStep.id]
                            || (currentStep.type === 'multi_choice' && answers[currentStep.id]?.length > 0))
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-105'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {step + 1 === totalSteps ? (
                        <>
                            <FaPaperPlane className="w-3 h-3" />
                            Submit
                        </>
                    ) : (
                        <>
                            Next
                            <FaArrowRight className="w-3 h-3" />
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export default FeedbackSurvey;
