import Image from 'next/image';
import React from 'react';

/**
 * Comparison table for alternative software articles.
 * Displays a responsive, professional table with pricing, ratings, and descriptions.
 * Supports both `url` and `website` fields from Hygraph alternatives JSON.
 */
const ComparisonTable = ({ alternatives = [], targetSoftware }) => {
  if (!alternatives.length) return null;

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <table className="w-full text-sm border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20">
            <th className="text-left px-4 py-3.5 font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
              Software
            </th>
            <th className="text-center px-4 py-3.5 font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
              Pricing
            </th>
            <th className="text-center px-4 py-3.5 font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
              Rating
            </th>
            <th className="text-left px-4 py-3.5 font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
              Best For
            </th>
          </tr>
        </thead>
        <tbody>
          {alternatives.map((alt, i) => {
            const link = alt.url || alt.website;
            return (
              <tr
                key={i}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-colors"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    {alt.logo && (
                      <div className='relative flex-none w-8 h-8'>
                        <Image fill src={alt.logo} alt={alt.name} className="rounded-lg object-contain" />
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white">{alt.name}</span>
                      {link && (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs text-violet-500 hover:text-violet-600 mt-0.5 transition-colors"
                        >
                          Visit →
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <PricingBadge pricing={alt.pricing} />
                </td>
                <td className="px-4 py-3.5 text-center">
                  <RatingDisplay rating={alt.rating} />
                </td>
                <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                  {alt.description
                    ? alt.description.length > 80
                      ? alt.description.slice(0, 80) + '…'
                      : alt.description
                    : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/** Styled pricing badge with color-coded backgrounds */
function PricingBadge({ pricing }) {
  if (!pricing) {
    return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">N/A</span>;
  }

  const lowerPricing = pricing.toLowerCase();
  let colorClasses = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';

  if (lowerPricing.includes('free') && !lowerPricing.includes('freemium')) {
    colorClasses = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  } else if (lowerPricing.includes('freemium') || lowerPricing.includes('free tier')) {
    colorClasses = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
  } else if (lowerPricing.includes('open') || lowerPricing.includes('oss')) {
    colorClasses = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  } else if (lowerPricing.includes('paid') || lowerPricing.includes('$')) {
    colorClasses = 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${colorClasses}`}>
      {pricing}
    </span>
  );
}

/** Star rating display with half-star support */
function RatingDisplay({ rating }) {
  if (!rating) {
    return <span className="text-gray-400 text-xs">—</span>;
  }

  const numRating = parseFloat(rating);
  const fullStars = Math.floor(numRating);
  const hasHalf = numRating % 1 >= 0.3;
  const stars = [];

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<span key={i} className="text-amber-400">★</span>);
    } else if (i === fullStars && hasHalf) {
      stars.push(<span key={i} className="text-amber-400 opacity-60">★</span>);
    } else {
      stars.push(<span key={i} className="text-gray-300 dark:text-gray-600">★</span>);
    }
  }

  return (
    <div className="flex items-center justify-center gap-0.5">
      <div className="flex text-xs">{stars}</div>
      <span className="font-bold text-gray-900 dark:text-white text-xs ml-1">{numRating.toFixed(1)}</span>
    </div>
  );
}

export default ComparisonTable;
