// components/WeglotScript.js

import { useEffect } from 'react';

const WeglotScript = () => {
    // Initialize Weglot
    useEffect(() => {
        const loadWeglotScript = () => {
            return new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = "https://cdn.weglot.com/weglot.min.js"; // Replace with the actual Weglot script URL
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };
        
        loadWeglotScript()
            .then(() => {
            const Weglot = typeof window.Weglot !== "undefined" ? window.Weglot : [];
            console.log('Weglot =====', Weglot);
            Weglot.initialize({
                api_key: 'wg_c335c86f26b6a721e35b01a63f70aaae4'
            });
            })
            .catch((error) => {
            console.error("Error loading Weglot script:", error);
            });
        }, []);
        

  return null; // This component doesn't render anything on the page
};

export default WeglotScript;
