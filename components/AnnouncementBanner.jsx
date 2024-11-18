import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

export const AnnouncementBanner = ({ 
    setShowBanner,
    setCloseBanner,
    showBanner,
    closeBanner
}) => {

  const handleCloseBanner = () => {
    setTimeout(() => {
      setShowBanner(false);
      setCloseBanner(true);
    }, 500);
  };

  const bannerStyle = {
    background: showBanner
        ? 'linear-gradient(to right, #4a00e0, #8e2de2)' // Vibrant purple gradient
        : 'none', // No background when banner is hidden
    boxShadow: showBanner ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none', // Subtle shadow when banner is shown
    transition: 'all 0.5s ease-in-out', // Smooth transition with easing
  };

  if (!showBanner) return null;

  return (
    <>
        {
            showBanner && (
                <>
                <div 
                style={bannerStyle}
                className={`bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs sm:text-sm relative top-0 left-0 right-0 z-10 
                    overflow-hidden
                ${
                    closeBanner ? 'p-0 transition-all duration-500' : 'p-3 sm:p-2'
                }`}
                >
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 container mx-auto justify-center text-center z-50">
                    <p className="flex items-center">
                    <span className="mr-2">🚀</span>
                    <span className="font-bold">Exciting news! We now offer sponsorship services for businesses. <Link href="/contact-us" className="underline hover:text-black transition-colors duration-300">Get in touch</Link> to learn more and boost your brand visibility.</span>
                    </p>
                    <button
                        className="ml-2 px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
                        onClick={handleCloseBanner}
                    >
                    Close
                    </button>
                    </div>
                    
                    <div
                    id="flash-div"
                    className={`absolute inset-0 -z-20 top-0 left-0 bg-indigo-900 bg-opacity-30 animated-banner
                        ${closeBanner ? 'hidden' : 'block'}
                    `}
                    >
                    </div>
                </div>
                </>
            )
        }
    </>
  );
};

AnnouncementBanner.propTypes = {
  setShowBanner: PropTypes.func.isRequired,
  setCloseBanner: PropTypes.func.isRequired,
  showBanner: PropTypes.bool.isRequired,
  closeBanner: PropTypes.bool.isRequired
};