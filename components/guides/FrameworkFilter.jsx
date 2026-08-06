import React, { useMemo } from 'react';

/**
 * Static base list of known frameworks with icons.
 * Any framework from the CMS data that isn't here gets auto-added at the end.
 */
const BASE_FRAMEWORKS = [
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
  { id: 'Bash', label: 'Bash', icon: '💻' },
  { id: 'Web Security', label: 'Web Security', icon: '🔒' },
  { id: 'Web Development', label: 'Web Development', icon: '🌐' },
  { id: 'AI', label: 'AI', icon: '🤖' },
  { id: 'Others', label: 'Others', icon: '📦' },
];

/**
 * Framework filter pills for the Guides hub.
 * Dynamically merges the base framework list with any new frameworks
 * found in the actual guide data from the CMS.
 *
 * @param {string} active - Currently active framework filter id
 * @param {function} onChange - Callback when user clicks a framework
 * @param {Array} guides - Array of guide objects from CMS (to extract frameworks dynamically)
 */
const FrameworkFilter = ({ active, onChange, guides = [] }) => {
  // Merge: keep base list order, then append any CMS frameworks not in the base list
  const frameworks = useMemo(() => {
    const baseIds = new Set(BASE_FRAMEWORKS.map((f) => f.id));
    const dynamicFrameworks = [];

    guides.forEach((g) => {
      if (g.framework && !baseIds.has(g.framework)) {
        baseIds.add(g.framework); // prevent duplicates
        dynamicFrameworks.push({
          id: g.framework,
          label: g.framework,
          icon: '🔧', // generic icon for unknown frameworks
        });
      }
    });

    // Insert dynamic ones before "Others" (which is last)
    const base = [...BASE_FRAMEWORKS];
    const othersIndex = base.findIndex((f) => f.id === 'Others');
    if (othersIndex !== -1 && dynamicFrameworks.length > 0) {
      base.splice(othersIndex, 0, ...dynamicFrameworks);
    } else {
      base.push(...dynamicFrameworks);
    }

    return base;
  }, [guides]);

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {frameworks.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          type="button"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
            ${active === id
              ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
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
