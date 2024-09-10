import React, { useState, useEffect } from 'react';

const AdSupportModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkAndShowModal = () => {
      const lastShownTime = localStorage.getItem('adSupportModalLastShown');
      const currentTime = new Date().getTime();
      //   const showInterval = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    //   const showInterval = 60 * 1000; // 1 minute in milliseconds
    const showInterval = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

      if (!lastShownTime || currentTime - parseInt(lastShownTime) > showInterval) {
        const handleScroll = () => {
          if (window.scrollY > 300 && !isVisible) {
            setIsVisible(true);
            localStorage.setItem('adSupportModalLastShown', currentTime.toString());
            window.removeEventListener('scroll', handleScroll);
          }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }
    };

    checkAndShowModal();
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto w-screen" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-2xl leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                  Support Our Content
                </h3>
                <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-2 font-semibold">
                        Thank you for reading!😍
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                        This blog is supported by 
                        <span className="text-blue-500"> carefully selected ads</span>. <br/> 
                        Your engagement helps us continue creating quality content for you.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-2 font-semibold">
                        Please consider supporting us by clicking on the ads you already like.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                        Thank you for your support!🙏
                    </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-800 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleClose}
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdSupportModal;
