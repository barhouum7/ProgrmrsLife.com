import React from 'react';

const DIFFICULTY_MAP = {
  beginner: {
    label: 'Beginner',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: '🟢',
  },
  intermediate: {
    label: 'Intermediate',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: '🟡',
  },
  advanced: {
    label: 'Advanced',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: '🔴',
  },
};

const DifficultyBadge = ({ difficulty, showIcon = true }) => {
  const config = DIFFICULTY_MAP[difficulty?.toLowerCase()] || DIFFICULTY_MAP.beginner;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${config.color}`}>
      {showIcon && <span>{config.icon}</span>}
      {config.label}
    </span>
  );
};

export default DifficultyBadge;
