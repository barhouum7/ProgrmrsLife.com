import { React, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const VersionNotifier = () => {
    const [showNotification, setShowNotification] = useState(false);
    const [waitingWorker, setWaitingWorker] = useState(null);
    const currentVersion = process.env.NEXT_PUBLIC_APP_VERSION || '2.0.18';


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


    // Immediate check on first load
    useEffect(() => {
      const checkVersionImmediately = async () => {
          try {
              // Check if we've already updated to this version
              const lastUpdateVersion = localStorage.getItem('lastUpdateVersion');
              if (lastUpdateVersion === currentVersion) {
                  return;
              }

              const response = await fetch('/version.json', {
                  cache: 'no-store',
                  headers: {
                      'Cache-Control': 'no-cache',
                      'Pragma': 'no-cache'
                  }
              });
              
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              
              const data = await response.json();
              
              if (data.version !== currentVersion) {
                  console.log('[Version Check] Update needed:', {
                      current: currentVersion,
                      new: data.version
                  });
                  setShowNotification(true);
              }
          } catch (error) {
              console.error('[Version Check] Failed:', error);
          }
      };

      checkVersionImmediately();
    }, [currentVersion]);

    const handleUpdate = () => {
        if (waitingWorker) {
            waitingWorker.postMessage({ type: 'SKIP_WAITING' });
        }
        
        // Store the current version as the last update version
        localStorage.setItem('lastUpdateVersion', currentVersion);
        setShowNotification(false);
        
        // Reload after a short delay to ensure service worker is activated
        setTimeout(() => {
            window.location.reload();
        }, 1000);
        
        toast.success('Installing update...', {
            duration: 3000
        });
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