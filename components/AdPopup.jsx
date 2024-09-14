import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AdPopup = ({ onClose, onAdLinkEntered }) => {
    const [adLink, setAdLink] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAdLinkChange = (e) => {
        setAdLink(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onAdLinkEntered(adLink);
        }, 2000);
        // console.log("Ad link submitted: ", adLink); 
    };

    return (
        <>
                <div className='absolute top-2 right-2 flex items-center'>
                    <span
                    // Escape keyboard key style
                    className='text-xs font-bold mr-2
                    px-1 py-0.5 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-300
                    dark:hover:bg-gray-600 dark:hover:text-gray-200
                    '
                    >
                        Esc
                    </span>
                    <button className='
                    text-2xl text-gray-600 hover:text-gray-800 cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 focus:outline-none
                    dark:text-gray-400 dark:hover:text-gray-200
                    ' onClick={onClose}>
                        <span
                        // Close icon
                        className='px-1 py-0.5'
                        >
                            &times;
                        </span>
                    </button>
                </div>
                <h2>Enter an Advertisement Link</h2>
                <p className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor"/>
                        <path d="M11 7H13V13H11V7Z" fill="currentColor"/>
                        <path d="M11 15H13V17H11V15Z" fill="currentColor"/>
                    </svg>

                    Enter the link of any Advertisement you see here.
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                    type="text"
                    className='w-full p-2 my-2 border border-gray-300 rounded
                    dark:bg-gray-800 dark:border-gray-700 dark:text-white
                    '
                    placeholder="https://www.googleadservices.com/pagead/aclk?..."
                    value={adLink}
                    onChange={handleAdLinkChange}
                    />
                    <button
                    type="submit"
                    className='w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ease-in-out
                    dark:bg-blue-400 dark:hover:bg-blue-500
                    '
                    >
                        {
                            loading ? (
                                <div className='flex items-center justify-center'>
                                    <svg className="w-4 h-4 mr-3" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                                                <stop stopColor="#fff" stopOpacity="0" offset="0%"/>
                                                <stop stopColor="#fff" stopOpacity=".631" offset="63.146%"/>
                                                <stop stopColor="#fff" offset="100%"/>
                                            </linearGradient>
                                        </defs>
                                        <g fill="none" fillRule="evenodd">
                                            <g transform="translate(1 1)">
                                                <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" strokeWidth="2">
                                                    <animateTransform
                                                        attributeName="transform"
                                                        type="rotate"
                                                        from="0 18 18"
                                                        to="360 18 18"
                                                        dur="0.9s"
                                                        repeatCount="indefinite" />
                                                </path>
                                                <circle fill="#fff" cx="36" cy="18" r="1">
                                                    <animateTransform
                                                        attributeName="transform"
                                                        type="rotate"
                                                        from="0 18 18"
                                                        to="360 18 18"
                                                        dur="0.9s"
                                                        repeatCount="indefinite" />
                                                </circle>
                                            </g>
                                        </g>
                                    </svg>
                                    Submitting
                                    <svg width="35" height="6" className="mt-1" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="#fff">
                                        <circle cx="15" cy="15" r="15" className='bg-gray-400' fill='currentColor'>
                                            <animate attributeName="r" from="15" to="15"
                                                    begin="0s" dur="0.8s"
                                                    values="15;9;15" calcMode="linear"
                                                    repeatCount="indefinite" />
                                            <animate attributeName="fill-opacity" from="1" to="1"
                                                    begin="0s" dur="0.8s"
                                                    values="1;.5;1" calcMode="linear"
                                                    repeatCount="indefinite" />
                                        </circle>
                                        <circle cx="60" cy="15" r="9" fillOpacity="0.3" className='bg-gray-400' fill='currentColor'>
                                            <animate attributeName="r" from="9" to="9"
                                                    begin="0s" dur="0.8s"
                                                    values="9;15;9" calcMode="linear"
                                                    repeatCount="indefinite" />
                                            <animate attributeName="fill-opacity" from="0.5" to="0.5"
                                                    begin="0s" dur="0.8s"
                                                    values=".5;1;.5" calcMode="linear"
                                                    repeatCount="indefinite" />
                                        </circle>
                                        <circle cx="105" cy="15" r="15" className='bg-gray-400' fill='currentColor'>
                                            <animate attributeName="r" from="15" to="15"
                                                    begin="0s" dur="0.8s"
                                                    values="15;9;15" calcMode="linear"
                                                    repeatCount="indefinite" />
                                            <animate attributeName="fill-opacity" from="1" to="1"
                                                    begin="0s" dur="0.8s"
                                                    values="1;.5;1" calcMode="linear"
                                                    repeatCount="indefinite" />
                                        </circle>
                                    </svg>
                                </div>
                            ) : (
                                <span>Submit</span>
                            )
                        }
                    </button>
                </form>
        </>
    );
};

AdPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
    onAdLinkEntered: PropTypes.func.isRequired,
};

export default AdPopup;