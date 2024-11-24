import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import PropTypes from 'prop-types';

const AdBlockWarning = ({ isBrave }) => {
  // const isBrave = (navigator.brave?.isBrave?.name === 'isBrave') || ('brave' in navigator);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900 bg-opacity-95">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-3xl mx-4 text-center shadow-2xl border-2 border-red-500">
          <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
            {isBrave ? 'Brave Shields Detected' : 'Ad Blocker Detected'}
          </h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300 space-y-2">
            {isBrave ? (
              <>
                <p>
                  {`We noticed you're using Brave browser with Shields enabled. `} 
                </p>
                <p>Our content is free, and we rely on 
                advertising revenue to maintain and improve our services.</p>
                <p>
                  Please disable Brave Shields for this website 
                  by clicking the Brave Shield icon
                  {' '}
                  <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                    🛡️
                  </span> {' '}
                  {`in your browser's address bar.`}
                </p>
              </>
            ) : (
              `We noticed you're using an ad blocker. Our content is free, and we rely on 
              advertising revenue to maintain and improve our services. Please disable your 
              ad blocker to continue accessing our website.`
            )}
          </p>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              After {isBrave ? 'disabling Brave Shields' : 'disabling your ad blocker'}, please refresh the page.
            </p>
            <Link 
              href="/about-us#support-us" 
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 underline"
            >
              Learn more about supporting us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

AdBlockWarning.propTypes = {
  isBrave: PropTypes.bool.isRequired,
};

export default AdBlockWarning;