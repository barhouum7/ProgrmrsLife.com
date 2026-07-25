import Image from 'next/image';
import React from 'react';

/**
 * Card display for a single software alternative with pros/cons and CTA.
 */
const AlternativeCard = ({ alternative, index }) => {
  const { name, description, pricing, pros, cons, url, logo, rating } = alternative;

  return (
    <div className="tool-glass p-6 hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-sm font-bold">
            {index + 1}
          </span>
          {logo && (
            <div className='relative flex-none w-10 h-10'>
              <Image fill src={logo} alt={name} className="rounded-lg object-contain" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{name}</h3>
            {pricing && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pricing.toLowerCase().includes('free')
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                {pricing}
              </span>
            )}
          </div>
        </div>
        {rating && (
          <div className="flex items-center gap-1 text-sm">
            <span className="text-amber-500">★</span>
            <span className="font-bold text-gray-900 dark:text-white">{rating}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
          {description}
        </p>
      )}

      {/* Pros / Cons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {pros && pros.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-2">
              ✓ Pros
            </h4>
            <ul className="space-y-1">
              {pros.map((pro, i) => (
                <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">+</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
        )}
        {cons && cons.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">
              ✗ Cons
            </h4>
            <ul className="space-y-1">
              {cons.map((con, i) => (
                <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                  <span className="text-red-500 mt-0.5 flex-shrink-0">−</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* CTA */}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="tool-btn tool-btn-primary w-full justify-center text-sm"
        >
          Visit {name} →
        </a>
      )}
    </div>
  );
};

export default AlternativeCard;
