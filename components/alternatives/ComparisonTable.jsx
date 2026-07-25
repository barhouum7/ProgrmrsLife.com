import Image from 'next/image';
import React from 'react';

/**
 * Comparison table for alternative software articles.
 * Displays a responsive table with feature comparisons.
 */
const ComparisonTable = ({ alternatives = [], targetSoftware }) => {
  if (!alternatives.length) return null;

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full text-sm border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-violet-50 dark:bg-violet-900/20">
            <th className="text-left px-4 py-3 font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
              Software
            </th>
            <th className="text-left px-4 py-3 font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
              Pricing
            </th>
            <th className="text-center px-4 py-3 font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
              Rating
            </th>
            <th className="text-center px-4 py-3 font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
              Best For
            </th>
          </tr>
        </thead>
        <tbody>
          {alternatives.map((alt, i) => (
            <tr
              key={i}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {alt.logo && (
                    <div className='relative flex-none w-8 h-8'>
                      <Image fill src={alt.logo} alt={alt.name} className="rounded-lg object-contain" />
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">{alt.name}</span>
                    {alt.url && (
                      <a
                        href={alt.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs text-violet-500 hover:text-violet-600 mt-0.5"
                      >
                        Visit →
                      </a>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${alt.pricing?.toLowerCase().includes('free')
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                  {alt.pricing || 'N/A'}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                {alt.rating ? (
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-amber-500">★</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{alt.rating}</span>
                    <span className="text-gray-400 text-xs">/5</span>
                  </div>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 text-xs">
                {alt.description ? alt.description.slice(0, 60) + (alt.description.length > 60 ? '…' : '') : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
