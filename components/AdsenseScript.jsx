// components/AdsenseScript.js

import { useEffect } from 'react';

const AdsenseScript = () => {
    // Initialize all the ad units on the page
    useEffect(() => {
        const loadAds = () => {
        try {
            if (window.adsbygoogle && document.getElementsByClassName("adsbygoogle").length > 0) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (error) {
            console.error('Error loading ads:', error);
        }
        };
    
        if (document.readyState === 'complete') {
        loadAds();
        } else {
        window.addEventListener('load', loadAds);
        return () => window.removeEventListener('load', loadAds);
        }
    }, []);

  return null; // This component doesn't render anything on the page
};

export default AdsenseScript;
