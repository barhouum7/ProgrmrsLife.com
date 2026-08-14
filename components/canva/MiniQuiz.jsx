import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPuzzlePiece, FaCheck, FaTimes, FaLightbulb, FaCode, FaTrophy, FaRedo, FaArrowRight, FaArrowLeft, FaCog } from 'react-icons/fa';

// ─── QUESTION BANKS BY FIELD ────────────────────────────────────────

const QUESTIONS = {
    javascript: [
        {
            code: `function mystery(arr) {\n  return arr.reduce((a, b) => a + b, 0) / arr.length;\n}`,
            question: 'What does this function return?',
            options: ['Sum of array', 'Average of array', 'Max of array', 'Array length'],
            correct: 1,
            explanation: 'It sums all elements and divides by the array length — that\'s the average!',
            difficulty: 'easy',
        },
        {
            code: `const x = [1, 2, 3];\nconst y = [...x, 4];\nconsole.log(x.length);`,
            question: 'What gets logged?',
            options: ['4', '3', 'undefined', 'Error'],
            correct: 1,
            explanation: 'Spread operator creates a new array. Original x stays [1,2,3] with length 3.',
            difficulty: 'easy',
        },
        {
            code: `let a = "5";\nlet b = 3;\nconsole.log(a - b);`,
            question: 'What gets logged?',
            options: ['"53"', '2', 'NaN', '8'],
            correct: 1,
            explanation: 'The minus operator coerces the string "5" to number 5, so 5 - 3 = 2.',
            difficulty: 'easy',
        },
        {
            code: `const obj = { a: 1, b: 2, a: 3 };\nconsole.log(obj.a);`,
            question: 'What gets logged?',
            options: ['1', '3', 'undefined', 'Error'],
            correct: 1,
            explanation: 'Duplicate keys overwrite — the last "a: 3" wins.',
            difficulty: 'medium',
        },
        {
            code: `console.log(typeof null);`,
            question: 'What gets logged?',
            options: ['"null"', '"object"', '"undefined"', '"boolean"'],
            correct: 1,
            explanation: 'This is a famous JavaScript bug. typeof null returns "object" — it\'s been this way since JS was created!',
            difficulty: 'medium',
        },
        {
            code: `const arr = [1, 2, 3];\narr[10] = 11;\nconsole.log(arr.length);`,
            question: 'What gets logged?',
            options: ['3', '4', '11', '10'],
            correct: 2,
            explanation: 'Setting index 10 creates "holes" — length becomes 11 (highest index + 1).',
            difficulty: 'medium',
        },
        {
            code: `for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}`,
            question: 'What gets printed?',
            options: ['0, 1, 2', '3, 3, 3', 'undefined x3', 'Error'],
            correct: 1,
            explanation: 'var is function-scoped, not block-scoped. By the time setTimeout runs, i is already 3. Use let to fix!',
            difficulty: 'hard',
        },
        {
            code: `const a = {};\nconst b = { key: 'b' };\nconst c = { key: 'c' };\na[b] = 123;\na[c] = 456;\nconsole.log(a[b]);`,
            question: 'What gets logged?',
            options: ['123', '456', 'undefined', 'Error'],
            correct: 1,
            explanation: 'Object keys are stringified. Both b and c become "[object Object]", so a[b] gets overwritten to 456.',
            difficulty: 'hard',
        },
        {
            code: `console.log(0.1 + 0.2 === 0.3);`,
            question: 'What gets logged?',
            options: ['true', 'false', 'NaN', 'Error'],
            correct: 1,
            explanation: 'Floating point precision! 0.1 + 0.2 = 0.30000000000000004, which is NOT equal to 0.3.',
            difficulty: 'hard',
        },
        {
            code: `const fn = () => arguments;\nconsole.log(fn(1, 2));`,
            question: 'What happens?',
            options: ['[1, 2]', 'undefined', 'ReferenceError', '{0: 1, 1: 2}'],
            correct: 2,
            explanation: 'Arrow functions don\'t have their own "arguments" object. This throws a ReferenceError!',
            difficulty: 'hard',
        },
    ],
    python: [
        {
            code: `x = [1, 2, 3]\ny = x\ny.append(4)\nprint(len(x))`,
            question: 'What gets printed?',
            options: ['3', '4', 'Error', 'None'],
            correct: 1,
            explanation: 'Lists are mutable references. y = x makes both point to the same list, so x also gets 4 appended.',
            difficulty: 'easy',
        },
        {
            code: `print(type([]) == list)`,
            question: 'What gets printed?',
            options: ['True', 'False', 'Error', 'None'],
            correct: 0,
            explanation: 'type([]) returns <class \'list\'>, which equals list. Result is True.',
            difficulty: 'easy',
        },
        {
            code: `def f(x=[]):\n    x.append(1)\n    return x\nprint(f())\nprint(f())`,
            question: 'What does the second print show?',
            options: ['[1]', '[1, 1]', 'Error', '[]'],
            correct: 1,
            explanation: 'Default mutable arguments are shared across calls! The list persists between function calls.',
            difficulty: 'medium',
        },
        {
            code: `a = "hello"\nb = "hello"\nprint(a is b)`,
            question: 'What gets printed?',
            options: ['True', 'False', 'Error', 'None'],
            correct: 0,
            explanation: 'Python interns small strings. Both a and b point to the same string object in memory.',
            difficulty: 'medium',
        },
        {
            code: `print({1, 2, 3} & {2, 3, 4})`,
            question: 'What gets printed?',
            options: ['{2, 3}', '{1, 2, 3, 4}', 'Error', 'True'],
            correct: 0,
            explanation: 'The & operator on sets returns the intersection — elements present in both sets.',
            difficulty: 'hard',
        },
    ],
    webdev: [
        {
            code: `<div style="display: flex;\n  justify-content: center;\n  align-items: center;">`,
            question: 'What does this CSS do?',
            options: ['Stacks items vertically', 'Centers content both ways', 'Hides the div', 'Makes it sticky'],
            correct: 1,
            explanation: 'Flexbox with justify-content and align-items: center perfectly centers content in both axes!',
            difficulty: 'easy',
        },
        {
            code: `<img src="photo.jpg"\n     loading="lazy"\n     alt="A photo">`,
            question: 'What does loading="lazy" do?',
            options: ['Loads slower', 'Loads when visible', 'Compresses image', 'Adds animation'],
            correct: 1,
            explanation: 'Native lazy loading defers image loading until it enters the viewport, improving page speed.',
            difficulty: 'easy',
        },
        {
            code: `position: sticky;\ntop: 0;`,
            question: 'What does this do to an element?',
            options: ['Fixes it to top always', 'Sticks to top when scrolled past', 'Makes it absolute', 'Hides it'],
            correct: 1,
            explanation: 'position: sticky makes an element stick to its scroll container when you scroll past it.',
            difficulty: 'medium',
        },
        {
            code: `localStorage.setItem("key", {a: 1});\nconsole.log(localStorage.getItem("key"));`,
            question: 'What gets logged?',
            options: ['{a: 1}', '"[object Object]"', 'null', 'Error'],
            correct: 1,
            explanation: 'localStorage only stores strings. Objects get .toString() which gives "[object Object]". Use JSON.stringify!',
            difficulty: 'hard',
        },
        {
            code: `fetch('/api/data')\n  .then(res => res.json())\n  .catch(err => /* ? */);`,
            question: 'When does .catch() fire?',
            options: ['On 404 response', 'On network failure', 'On any error', 'Both A and B'],
            correct: 1,
            explanation: 'fetch only rejects on network failures. HTTP errors (404, 500) resolve normally! Check res.ok to handle them.',
            difficulty: 'hard',
        },
    ],
};

// ─── DIFFICULTY CONFIG ──────────────────────────────────────────────
const DIFFICULTIES = {
    easy: { label: '🟢 Easy', count: 5, required: 3, color: 'from-green-400 to-emerald-500' },
    medium: { label: '🟡 Medium', count: 5, required: 3, color: 'from-amber-400 to-orange-500' },
    hard: { label: '🔴 Hard', count: 5, required: 2, color: 'from-red-400 to-rose-500' },
    mixed: { label: '🎲 Mixed', count: 5, required: 3, color: 'from-violet-400 to-purple-500' },
};

const FIELDS = {
    javascript: { label: '⚡ JavaScript', icon: 'JS' },
    python: { label: '🐍 Python', icon: 'PY' },
    webdev: { label: '🌐 Web Dev', icon: 'WEB' },
};

const REQUIRED_CORRECT_DEFAULT = 3;
const ANSWER_REVEAL_DURATION = 4500; // 4.5 seconds to review each answer

/**
 * MiniQuiz — Configurable programming quiz with difficulty & field selection
 * 
 * Features:
 * - Choose difficulty (easy/medium/hard/mixed) and field (JS/Python/WebDev)
 * - Slower answer reveals (4.5s) with manual "Continue" button
 * - Back navigation to review previous answers
 * - Score tracking with animated results
 */
const MiniQuiz = ({ onComplete, isCompleted = false }) => {
    // ─── Setup State ────────────────────────────────────────────────
    const [phase, setPhase] = useState(isCompleted ? 'completed' : 'setup'); // setup | quiz | finished | completed
    const [selectedField, setSelectedField] = useState('javascript');
    const [selectedDifficulty, setSelectedDifficulty] = useState('mixed');

    // ─── Quiz State ─────────────────────────────────────────────────
    const [questions, setQuestions] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionIndex: selectedOptionIndex }
    const [revealedQ, setRevealedQ] = useState(-1); // which question's answer is revealed
    const [score, setScore] = useState(0);
    const [canContinue, setCanContinue] = useState(false);
    const timerRef = useRef(null);

    const requiredCorrect = DIFFICULTIES[selectedDifficulty]?.required || REQUIRED_CORRECT_DEFAULT;

    // ─── START QUIZ ─────────────────────────────────────────────────
    const startQuiz = useCallback(() => {
        const pool = QUESTIONS[selectedField] || QUESTIONS.javascript;
        let filtered;

        if (selectedDifficulty === 'mixed') {
            filtered = [...pool].sort(() => Math.random() - 0.5);
        } else {
            const difficultyPool = pool.filter(q => q.difficulty === selectedDifficulty);
            // If not enough questions of that difficulty, pad with others
            const others = pool.filter(q => q.difficulty !== selectedDifficulty).sort(() => Math.random() - 0.5);
            filtered = [...difficultyPool.sort(() => Math.random() - 0.5), ...others];
        }

        const count = DIFFICULTIES[selectedDifficulty]?.count || 5;
        setQuestions(filtered.slice(0, count));
        setCurrentQ(0);
        setAnswers({});
        setRevealedQ(-1);
        setScore(0);
        setCanContinue(false);
        setPhase('quiz');
    }, [selectedField, selectedDifficulty]);

    const resetQuiz = useCallback(() => {
        setPhase('setup');
    }, []);

    // ─── ANSWER SELECTION ───────────────────────────────────────────
    const handleSelect = useCallback((idx) => {
        if (answers[currentQ] !== undefined) return; // Already answered

        const newAnswers = { ...answers, [currentQ]: idx };
        setAnswers(newAnswers);
        setRevealedQ(currentQ);

        // Calculate score
        const isCorrect = idx === questions[currentQ].correct;
        if (isCorrect) setScore(prev => prev + 1);

        // Enable "Continue" after the reveal duration
        setCanContinue(false);
        timerRef.current = setTimeout(() => {
            setCanContinue(true);
        }, ANSWER_REVEAL_DURATION);
    }, [answers, currentQ, questions]);

    // ─── NAVIGATION ─────────────────────────────────────────────────
    const goNext = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);

        if (currentQ + 1 < questions.length) {
            setCurrentQ(prev => prev + 1);
            setCanContinue(false);
        } else {
            // Calculate final score
            const finalScore = Object.entries(answers).reduce((acc, [qIdx, ansIdx]) => {
                return acc + (ansIdx === questions[parseInt(qIdx)]?.correct ? 1 : 0);
            }, 0);
            // Include the current answer too if just answered
            const lastAnswer = answers[currentQ];
            const lastCorrect = lastAnswer === questions[currentQ]?.correct;
            const adjustedScore = finalScore + (lastCorrect && answers[currentQ] === undefined ? 1 : 0);

            setScore(finalScore);
            setPhase('finished');

            if (finalScore >= requiredCorrect) {
                onComplete?.();
            }
        }
    }, [currentQ, questions, answers, requiredCorrect, onComplete]);

    const goPrev = useCallback(() => {
        if (currentQ > 0) {
            setCurrentQ(prev => prev - 1);
            setCanContinue(true); // Can always continue when going back
        }
    }, [currentQ]);

    // Cleanup timer
    useEffect(() => {
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, []);

    // ─── COMPLETED STATE ────────────────────────────────────────────
    if (phase === 'completed') {
        return (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200/30 dark:border-green-700/20">
                <FaTrophy className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Quiz completed! ✓</span>
            </div>
        );
    }

    // ─── SETUP SCREEN ───────────────────────────────────────────────
    if (phase === 'setup') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-xl border bg-white/80 dark:bg-gray-800/80 border-gray-200/30 dark:border-gray-700/20 space-y-4"
            >
                <div className="flex items-center gap-2">
                    <FaCog className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Quiz Settings</h3>
                </div>

                {/* Field Selection */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Choose Topic</label>
                    <div className="grid grid-cols-3 gap-2">
                        {Object.entries(FIELDS).map(([key, field]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedField(key)}
                                className={`p-2.5 rounded-lg text-xs font-medium text-center transition-all duration-200 border
                                    ${selectedField === key
                                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700/50 ring-1 ring-amber-300/50 text-amber-700 dark:text-amber-400'
                                        : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200/50 dark:border-gray-600/30 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60'
                                    }`}
                            >
                                {field.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Difficulty Selection */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Choose Difficulty</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {Object.entries(DIFFICULTIES).map(([key, diff]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedDifficulty(key)}
                                className={`p-2.5 rounded-lg text-xs font-medium text-center transition-all duration-200 border
                                    ${selectedDifficulty === key
                                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700/50 ring-1 ring-amber-300/50 text-amber-700 dark:text-amber-400'
                                        : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200/50 dark:border-gray-600/30 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60'
                                    }`}
                            >
                                {diff.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/20 dark:border-amber-700/10">
                    <FaLightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span className="text-[11px] text-amber-700 dark:text-amber-400">
                        {DIFFICULTIES[selectedDifficulty]?.count || 5} questions · Need {requiredCorrect} correct to pass
                    </span>
                </div>

                <button
                    onClick={startQuiz}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold text-white
                        bg-gradient-to-r from-amber-500 to-orange-500
                        hover:from-amber-600 hover:to-orange-600
                        transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/20
                        flex items-center justify-center gap-2"
                >
                    <FaPuzzlePiece className="w-3.5 h-3.5" />
                    Start Quiz
                </button>
            </motion.div>
        );
    }

    // ─── FINISHED SCREEN ────────────────────────────────────────────
    if (phase === 'finished') {
        const passed = score >= requiredCorrect;

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-xl border bg-white/80 dark:bg-gray-800/80 border-gray-200/30 dark:border-gray-700/20"
            >
                <div className="text-center space-y-3">
                    <div className="text-4xl">{passed ? '🏆' : '😔'}</div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        {passed ? 'Congratulations!' : 'Almost there!'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        You got <span className="font-bold text-lg">{score}/{questions.length}</span> correct
                        {passed
                            ? ' — Quiz task completed!'
                            : ` — Need ${requiredCorrect} to pass. Try again!`
                        }
                    </p>

                    {/* Score bar */}
                    <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-auto max-w-xs">
                        <motion.div
                            className={`absolute inset-y-0 left-0 rounded-full ${passed
                                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                : 'bg-gradient-to-r from-amber-400 to-orange-500'
                                }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(score / questions.length) * 100}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                    </div>

                    {!passed && (
                        <button
                            onClick={resetQuiz}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                                bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400
                                hover:bg-amber-200 dark:hover:bg-amber-800/40 transition-colors"
                        >
                            <FaRedo className="w-3 h-3" />
                            Try Again
                        </button>
                    )}
                </div>
            </motion.div>
        );
    }

    // ─── QUIZ IN PROGRESS ───────────────────────────────────────────
    if (questions.length === 0) return null;

    const q = questions[currentQ];
    const isAnswered = answers[currentQ] !== undefined;
    const isRevealed = isAnswered; // Show result immediately after selecting
    const selectedAnswer = answers[currentQ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-xl border bg-white/80 dark:bg-gray-800/80 border-gray-200/30 dark:border-gray-700/20 space-y-4"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FaCode className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Question {currentQ + 1}/{questions.length}
                    </span>
                    {q.difficulty && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium
                            ${q.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : q.difficulty === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                            {q.difficulty}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {questions.map((_, i) => {
                        const isAnsweredQ = answers[i] !== undefined;
                        const wasCorrect = isAnsweredQ && answers[i] === questions[i].correct;
                        return (
                            <button
                                key={i}
                                onClick={() => { if (isAnsweredQ || i === currentQ) setCurrentQ(i); setCanContinue(true); }}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer
                                    ${i === currentQ
                                        ? 'bg-amber-500 scale-150 ring-2 ring-amber-300/50'
                                        : isAnsweredQ
                                            ? wasCorrect
                                                ? 'bg-green-400'
                                                : 'bg-red-400'
                                            : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                title={`Question ${i + 1}`}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Code Block */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQ}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap leading-relaxed">
                            {q.code}
                        </pre>
                    </div>

                    {/* Question */}
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">{q.question}</p>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                        {q.options.map((opt, i) => {
                            const isCorrect = i === q.correct;
                            const isSelected = selectedAnswer === i;

                            let optionStyle = 'bg-gray-50 dark:bg-gray-700/40 border-gray-200/50 dark:border-gray-600/30 hover:bg-gray-100 dark:hover:bg-gray-700/60';

                            if (isRevealed) {
                                if (isCorrect) {
                                    optionStyle = 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700/50 ring-1 ring-green-300/50';
                                } else if (isSelected && !isCorrect) {
                                    optionStyle = 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700/50 ring-1 ring-red-300/50';
                                } else {
                                    optionStyle = 'bg-gray-50 dark:bg-gray-700/40 border-gray-200/50 dark:border-gray-600/30 opacity-50';
                                }
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleSelect(i)}
                                    disabled={isAnswered}
                                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-left text-sm transition-all duration-200 ${optionStyle}`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                                        ${isRevealed && isCorrect
                                            ? 'bg-green-500 text-white'
                                            : isRevealed && isSelected && !isCorrect
                                                ? 'bg-red-500 text-white'
                                                : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                                        }`}
                                    >
                                        {isRevealed && isCorrect ? <FaCheck className="w-3 h-3" /> :
                                            isRevealed && isSelected && !isCorrect ? <FaTimes className="w-3 h-3" /> :
                                                String.fromCharCode(65 + i)}
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Explanation */}
                    <AnimatePresence>
                        {isRevealed && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`flex items-start gap-2 p-3 rounded-lg text-sm mt-3 ${selectedAnswer === q.correct
                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                    : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                                    }`}
                            >
                                <FaLightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>{q.explanation}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-1">
                <button
                    onClick={goPrev}
                    disabled={currentQ === 0}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                        ${currentQ === 0
                            ? 'opacity-0 pointer-events-none'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                        }`}
                >
                    <FaArrowLeft className="w-3 h-3" />
                    Back
                </button>

                {isAnswered && (
                    <button
                        onClick={goNext}
                        disabled={!canContinue}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                            ${canContinue
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/20'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {currentQ + 1 === questions.length ? (
                            <>
                                <FaTrophy className="w-3 h-3" />
                                See Results
                            </>
                        ) : (
                            <>
                                Continue
                                <FaArrowRight className="w-3 h-3" />
                            </>
                        )}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default MiniQuiz;
