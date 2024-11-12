import { React, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const VersionNotifier = () => {
    const [showNotification, setShowNotification] = useState(false);
    const [waitingWorker, setWaitingWorker] = useState(null);
    const currentVersion = process.env.NEXT_PUBLIC_APP_VERSION || '2.0.16';

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            // Register the service worker
            navigator.serviceWorker.register('/service-worker.js').then((registration) => {
                // Add listener for new updates
                registration.addEventListener('waiting', (event) => {
                    setWaitingWorker(event.target);
                });

                // Check if there's already a waiting worker
                if (registration.waiting) {
                    setWaitingWorker(registration.waiting);
                }

                // Add listener for controlling change
                registration.addEventListener('controlling', () => {
                    window.location.reload();
                });
            });
        }
    }, []);

    useEffect(() => {
        const checkVersion = async () => {
          try {
            // Check if user just updated
            const lastUpdateVersion = localStorage.getItem('lastUpdateVersion');
            if (lastUpdateVersion === currentVersion) {
              return;
            }

            const response = await fetch('/version.json', { cache: 'no-store' });
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.version !== currentVersion) {
              console.log('[Version Check] New version available:', data.version);
              setShowNotification(true);
            }
          } catch (error) {
            console.error('[Version Check] Failed:', error);
          }
        };
      
        // Check immediately and then every 5 minutes
        checkVersion();
        const interval = setInterval(checkVersion, 5 * 60 * 1000);
      
        return () => clearInterval(interval);
      }, [currentVersion]);

      const handleUpdate = () => {
          if (waitingWorker) {
              // Properly handle the service worker update
              waitingWorker.postMessage({ type: 'SKIP_WAITING' });
              localStorage.setItem('lastUpdateVersion', currentVersion);
              toast.success('Installing update...');
          } else {
              // Fallback for when service worker isn't available
              localStorage.setItem('lastUpdateVersion', currentVersion);
              toast.success('Updating to the latest version...');
              window.location.reload();
          }
      };
    
      useEffect(() => {
        if (showNotification) {
          const toastId = toast(
            (t) => (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <span role="img" aria-label="sparkles">✨</span>
                  <span>New version available!</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      toast.dismiss(t.id);
                      handleUpdate();
                    }}
                    className="px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      toast.dismiss(t.id);
                      setShowNotification(false);
                    }}
                    className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Later
                  </button>
                </div>
              </motion.div>
            ),
            {
              duration: Infinity,
              position: 'top-center',
              style: {
                minWidth: '300px',
                backgroundColor: 'white',
                color: 'black'
              }
            }
          );

          return () => toast.dismiss(toastId);
        }
      }, [showNotification]);

      return null;
};

export default VersionNotifier;