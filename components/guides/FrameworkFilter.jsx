import React from 'react';

const FRAMEWORKS = [
  { id: 'all', label: 'All', icon: '🌐' },
  { id: 'Next.js', label: 'Next.js', icon: '▲' },
  { id: 'React', label: 'React', icon: '⚛️' },
  { id: 'Node.js', label: 'Node.js', icon: '🟢' },
  { id: 'Python', label: 'Python', icon: '🐍' },
  { id: 'TypeScript', label: 'TypeScript', icon: '🔷' },
  { id: 'JavaScript', label: 'JavaScript', icon: '🟨' },
  { id: 'CSS', label: 'CSS', icon: '🎨' },
  { id: 'Git', label: 'Git', icon: '🔀' },
  { id: 'Docker', label: 'Docker', icon: '🐳' },
  { id: 'Linux', label: 'Linux', icon: '🐧' },
  { id: 'Bash', label: 'Bash', icon: '🐧' },
  { id: 'Web Security', label: 'Web Security', icon: '🔒' },
  { id: 'Web Development', label: 'Web Development', icon: '🌐' },
  { id: 'AI', label: 'AI', icon: '🤖' },
  { id: 'Others', label: 'Others', icon: '...' },
];

const FrameworkFilter = ({ active, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {FRAMEWORKS.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          type="button"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
            ${active === id
              ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 ring-1 ring-violet-300 dark:ring-violet-600 shadow-sm'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
          <span className="text-sm">{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

export default FrameworkFilter;
