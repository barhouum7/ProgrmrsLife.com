// components/AWeberScript.js

import { useEffect } from 'react';

const AWeberScript = () => {
    // Initialize Aweber Script for push notifications
    useEffect(() => {
        var AWeber = typeof window.AWeber !== "undefined" ? window.AWeber : []
        console.log(AWeber);
            AWeber.push(function() {
                AWeber.WebPush.init(
                    'BPWeSrUv87tnPkdoNOpUlMTllSqJ-fyJCJlYT2eeU8M6fBSFwO4FfQWcU83SEte8wowpIdhAH2P19HJDkUuAmAc',
                    'a8f015e0-3041-4a1c-be7f-e8817369ba07',
                    '9b0f384d-00c7-46f4-b678-2d996e3f2e4a'
                );
            });
    }, []);

  return null; // This component doesn't render anything on the page
};

export default AWeberScript;
