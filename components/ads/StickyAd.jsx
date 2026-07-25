import React, { useEffect, useRef, useState } from 'react';

/**
 * Sticky sidebar ad component — follows the user on scroll.
 * Hides on mobile to preserve screen real estate.
 */
const StickyAd = ({ adSlot = '3167248456', adClient = 'ca-pub-5021308603136043', className = '' }) => {
  const adRef = useRef(null);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    try {
      if (adRef.current && window.adsbygoogle && !adLoaded) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      }
    } catch (e) {
      // Ad blocker or script not loaded
    }
  }, [adLoaded]);

  return (
    <div className={`hidden lg:block ${className}`}>
      <div className="sticky top-24">
        <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 p-1">
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          <p className="text-[10px] text-center text-gray-300 dark:text-gray-700 mt-1 select-none">
            Advertisement
          </p>
        </div>
      </div>
    </div>
  );
};

export default StickyAd;
