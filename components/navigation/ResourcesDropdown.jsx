import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

/**
 * "Resources" dropdown for the main header navigation.
 * Contains links to Dev Tools, Guides, and Alternatives hubs.
 */
const ResourcesDropdown = ({ currentPath, isScrolled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const resources = [
    {
      href: '/tools',
      icon: '🛠️',
      label: 'Dev Tools',
      description: 'JSON, Base64, Regex & more',
      badge: 'NEW',
    },
    {
      href: '/guides',
      icon: '📖',
      label: 'Guides',
      description: 'How-to articles & code fixes',
      badge: null,
    },
    {
      href: '/alternatives',
      icon: '⇄',
      label: 'Alternatives',
      description: 'Software comparisons',
      badge: null,
    },
  ];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = resources.some((r) => currentPath.startsWith(r.href));

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger */}
      <button
        type="button"
        className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200
          ${isActive
            ? 'text-violet-600 dark:text-violet-400'
            : 'text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400'
          }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Resources
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Panel */}
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-xl shadow-xl border
          bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700
          transition-all duration-200 origin-top z-50
          ${isOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
          }`}
      >
        <div className="p-2">
          {resources.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150
                ${currentPath.startsWith(item.href)
                  ? 'bg-violet-50 dark:bg-violet-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xl mt-0.5 flex-shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${
                    currentPath.startsWith(item.href)
                      ? 'text-violet-600 dark:text-violet-400'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-full
                      bg-gradient-to-r from-violet-500 to-pink-500 text-white leading-none">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesDropdown;
