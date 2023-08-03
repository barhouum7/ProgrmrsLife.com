// components/AdsenseScript.js

import { useEffect } from 'react';

const AdsenseScript = () => {
    // Initialize all the ad units on the page
    useEffect(() => {
        console.log('AdsenseScript');
        var ads = document.getElementsByClassName("adsbygoogle").length;
            for (var i = 0; i < ads; i++) {
                try {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                } catch (e) { }
            }
        console.log('adsbygoogle: ', document.getElementsByClassName("adsbygoogle"));
    }, []);

  return null; // This component doesn't render anything on the page
};

export default AdsenseScript;
