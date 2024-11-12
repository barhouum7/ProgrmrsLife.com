import React from 'react';
import PropTypes from "prop-types";

const CanvaWarningModal = ({setShowCanvaWarning}) => (
    <>
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50
            dark:bg-white dark:bg-opacity-50 dark:text-black dark:dark-mode-text'
            onClick={() => setShowCanvaWarning(false)}
        ></div>
        <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            bg-white p-8 z-50 rounded-lg shadow-md w-11/12 max-w-lg
            dark:bg-gray-800 dark:border-gray-700 dark:text-white'
        >
            <div className="flex flex-col items-center">
                <div className="mb-4">
                    <svg className="w-16 h-16 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">Important Update!</h3>
                <p className="text-center mb-6">
                    Canva has made a major change to team links: now, each team can only accept <span className="font-bold text-yellow-400">100 members</span>, down from the previous limit of 500.
                </p>
                <p className="text-center mb-6">
                    Please act quickly whenever we share links, as the limit has been significantly reduced.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center italic">
                    Please consider staying on our site for at least a minute so we can get few benefits and survive longer!
                </p>
                <button
                    onClick={() => setShowCanvaWarning(false)}
                    className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                    I Understand
                </button>
            </div>
        </div>
    </>
);

CanvaWarningModal.propTypes = {
    setShowCanvaWarning: PropTypes.func.isRequired
};

export default CanvaWarningModal;