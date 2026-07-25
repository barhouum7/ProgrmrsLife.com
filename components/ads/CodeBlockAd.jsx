import React, { useEffect, useRef, useState } from 'react';

/**
 * Slim, text-based ad unit optimized for placement above/below code blocks.
 * Non-intrusive, similar to Carbon Ads / EthicalAds aesthetic.
 */
const CodeBlockAd = ({ adSlot = '3167248456', adClient = 'ca-pub-5021308603136043', className = '' }) => {
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
    <div className={`my-4 ${className}`}>
      <div className="rounded-lg overflow-hidden bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800/50">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client={adClient}
          data-ad-slot={adSlot}
        />
      </div>
    </div>
  );
};

export default CodeBlockAd;
