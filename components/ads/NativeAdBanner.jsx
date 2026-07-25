import React from 'react';
import Link from 'next/link';

/**
 * Local sponsor configuration.
 * Fetched from local JSON — not Hygraph — as per user preference.
 */
const DEFAULT_SPONSORS = [
  {
    id: 'progrmrslife-tools',
    title: 'Free Developer Tools',
    description: 'JSON Formatter, Base64, Regex Tester, and 7 more tools — all free, all private.',
    ctaText: 'Try Dev Tools →',
    ctaUrl: '/tools',
    icon: '🛠️',
    bgGradient: 'from-violet-500/10 to-purple-500/10',
    borderColor: 'border-violet-200 dark:border-violet-800/40',
    isInternal: true,
  },
];

/**
 * Native ad banner that blends with site content.
 * Uses local JSON config — ad-blocker resistant since it's baked into HTML.
 */
const NativeAdBanner = ({ sponsor, className = '' }) => {
  const s = sponsor || DEFAULT_SPONSORS[0];

  return (
    <div className={`my-6 ${className}`}>
      <div className={`relative overflow-hidden rounded-xl border ${s.borderColor || 'border-gray-200 dark:border-gray-700'}
        bg-gradient-to-r ${s.bgGradient || 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900'}
        p-4 sm:p-5 transition-all duration-300 hover:shadow-md`}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 text-2xl mt-0.5">
            {s.icon || '📢'}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                {s.title}
              </h4>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">
                Sponsored
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
              {s.description}
            </p>
            {s.isInternal ? (
              <Link
                href={s.ctaUrl}
                className="inline-flex items-center text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
              >
                {s.ctaText}
              </Link>
            ) : (
              <a
                href={s.ctaUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
              >
                {s.ctaText}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { DEFAULT_SPONSORS };
export default NativeAdBanner;
