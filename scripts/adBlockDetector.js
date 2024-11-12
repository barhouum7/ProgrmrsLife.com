const checkAdBlocker = () => {
  return new Promise((resolve) => {
    // Method 1: Check for Brave browser with active shields
    const checkBrave = async () => {
      try {
        // Only consider Brave if shields are blocking ads
        const isBrave = (navigator.brave?.isBrave?.name === 'isBrave') || ('brave' in navigator);
        if (!isBrave) return false;

        // Test if shields are active by trying to load an ad domain
        const testResponse = await fetch('https://doubleclick.net/test', { 
          method: 'HEAD', 
          mode: 'no-cors' 
        });
        
        return false; // If fetch succeeds, shields are off
      } catch (error) {
        // If fetch fails on Brave browser, shields are likely on
        return true;
      }
    };

    // Method 2: Check for blocked bait element
    const checkBaitElement = () => {
      const bait = document.createElement('div');
      bait.setAttribute('class', 'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links ad-text adSense adBlock');
      bait.setAttribute('style', 'width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;');
      document.body.appendChild(bait);

      const computedStyle = window.getComputedStyle(bait);
      // console.log('Bait element computed display:', computedStyle.display);
      // console.log('Bait element offset height:', bait.offsetHeight);
      // console.log('Bait element offset parent:', bait.offsetParent);

      const isBlocked = (
        computedStyle.display === 'none' ||
        bait.offsetHeight === 0 ||
        bait.offsetParent === null
      );

      document.body.removeChild(bait);
      // console.log('Bait element check result:', isBlocked);
      return isBlocked;
    };

    // Method 3: Check Google Adsense
    const checkGoogleAds = () => {
      const isBlocked = typeof window.adsbygoogle === 'undefined' || !window.adsbygoogle.loaded;
      // console.log('Google Ads check - adsbygoogle exists:', typeof window.adsbygoogle !== 'undefined');
      // console.log('Google Ads check - loaded status:', window.adsbygoogle?.loaded);
      // console.log('Google Ads check result:', isBlocked);
      return isBlocked;
    };

    // Method 4: Check for blocked domains
    const checkBlockedDomains = async () => {
      try {
        const testUrls = [
          'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
          'https://doubleclick.net',
          'https://googleadservices.com'
        ];

        // console.log('Testing domains:', testUrls);
        const results = await Promise.all(
          testUrls.map(async url => {
            try {
              await fetch(url, { method: 'HEAD', mode: 'no-cors' });
              // console.log(`Domain ${url} is accessible`);
              return false;
            } catch (error) {
              // console.log(`Domain ${url} is blocked:`, error.message);
              return true;
            }
          })
        );

        const isBlocked = results.some(blocked => blocked);
        // console.log('Domain blocking check result:', isBlocked);
        return isBlocked;
      } catch (error) {
        // console.error('Domain checking error:', error);
        return true;
      }
    };

    // Combine all checks
    const runChecks = async () => {
      try {
        // console.log('Starting ad blocker detection checks...');
        
        const isBraveBlocking = await checkBrave();
        // console.log('Brave shields check completed');
        
        const isBaitBlocked = checkBaitElement();
        // console.log('Bait element check completed');
        
        const isGoogleAdsBlocked = checkGoogleAds();
        // console.log('Google Ads check completed');
        
        const isDomainsBlocked = await checkBlockedDomains();
        // console.log('Domain blocking check completed');

        const isBlocked = isBraveBlocking || isBaitBlocked || isGoogleAdsBlocked || isDomainsBlocked;
        // console.log('Final ad blocker detection result:', isBlocked, {
        //   isBraveBlocking,
        //   isBaitBlocked,
        //   isGoogleAdsBlocked,
        //   isDomainsBlocked
        // });
        
        resolve(isBlocked);
      } catch (error) {
        // console.error('Ad blocker detection error:', error);
        resolve(false); // Don't assume blocked if there's an error
      }
    };

    // Add a small delay to ensure all checks run properly
    // console.log('Initiating ad blocker detection with delay...');
    setTimeout(runChecks, 100);
  });
};

export default checkAdBlocker;