import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaPlay, FaComment } from 'react-icons/fa';
import '@fortawesome/fontawesome-free/css/all.css';
// import { Helmet } from 'react-helmet-async';
import Head from 'next/head';
import duotoneDark from 'prism-react-renderer/themes/duotoneDark';
import duotoneLight from 'prism-react-renderer/themes/duotoneLight';

import { Prism } from '@mantine/prism';

import { RichText } from '@graphcms/rich-text-react-renderer';
import moment from 'moment';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Tooltip } from "flowbite-react";
import toast, { Toaster } from 'react-hot-toast';

import { AdPopup, AdsenseScript, Breadcrumbs } from "../components"
import Image from 'next/image';
import Script from 'next/script';

const PostDetail = ({ post, onCopyToClipboard, isCopied, onEnablePopupMessage, showToast, showWelcomeMessage }) => {

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const [showPopupPage, setShowPopupPage] = useState(false);
    const [showWaitingBlock, setShowWaitingBlock] = useState(false);
    const [showWaitingText, setShowWaitingText] = useState(false);
    const [showGetLinkButton, setShowGetLinkButton] = useState(false);
    const [showGoToLinkButton, setShowGoToLinkButton] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {
        const isReturningUser = localStorage.getItem('returningUser') === 'true';

        if (isReturningUser && post.slug !== undefined && post.slug !== null) {
            setShowWaitingBlock(false);
            setShowWaitingText(false);
            setCountdown(30);
            setShowGoToLinkButton(false);
        }

    }, [post.slug]);

    const startCountdown = () => {
        const countdownTimeout = setInterval(() => {
            setCountdown(prevCountdown => prevCountdown - 1);
        }, 1000); // 1-second countdown

        setTimeout(() => {
            setShowWaitingBlock(true);
            clearInterval(countdownTimeout);
        }, 30000); // 30-second countdown

        return () => {
            clearTimeout(countdownTimeout); // Clear the timeout when the component is unmounted or updated
        };
    }



    // Popup page customizations ...

    const onCloseButtonClick = () => {
        setShowPopupPage(false);
    };
    
    // Table of Contents customizations ...
    const handleToggleElementClick = () => {
        
            typeof window !== 'undefined' && window.document.querySelector('.table-of-contents .toggle-element').classList.add('rotate-180', 'transition', 'duration-500', 'ease-in-out');
        
        const tableOfContents = typeof window !== 'undefined' && window.document.querySelector('.table-of-contents'); // Select the specific <div> element with class name 'table-of-contents'
        
        if (!tableOfContents) return; // If the table of contents doesn't exist, return
        
        // Toggle element click event handler logic...
        const pTags = tableOfContents.querySelectorAll('p');
        const isCollapsed = pTags[0].classList.contains('hidden');
        pTags.forEach((pTag, index) => {
            if (isCollapsed && index <= 3) {
                pTag.classList.remove('hidden');
                typeof window !== 'undefined' && window.document.querySelector('.table-of-contents .toggle-element').classList.remove('rotate-180');
            } else {
                pTag.classList.add('hidden');
            }
        });

        // Change the text of the toggle elements `View All` and `View Less`
        const tableOfContentsDivTags = typeof window !== 'undefined' && window.document.querySelectorAll('.table-of-contents div');
        tableOfContentsDivTags.forEach((divTag) => {
            
            const isViewAll = divTag.classList.contains('view-all-tag');
            const isViewLess = divTag.classList.contains('view-less-tag');
            const divTagChildren = divTag.children[0];

            if (isViewAll) {
                divTagChildren.innerHTML = '<button>View All</button>';
            } else if (isViewLess) {
                divTagChildren.innerHTML = '<button>View Less</button>';
            }
        });

        // Show the first three elements of the table of contents, and show 'view all' after the third element, and show all elements in the table of contents after clicking 'view all'
        const tableOfContentsPTags = typeof window !== 'undefined' && window.document.querySelectorAll('.table-of-contents p');
        if (!tableOfContentsPTags) return; // If the table of contents doesn't exist, return

        const viewAllPTag = tableOfContentsPTags[3];
        tableOfContentsPTags.forEach((pTag, index) => {
            const isViewAll = pTag.innerText === 'View All';
            const isViewLess = pTag.innerText === 'View Less';
            
            const pTagChildren = pTag.children[0];
        
            if (index > 3) {
            pTag.classList.add('hidden');
            }
        
            // Change the style of the span element within the p tag
            if (isViewAll || isViewLess) {
                pTagChildren.classList.add('cursor-pointer', 'font-bold', 'text-indigo-600', 'hover:text-indigo-800', 'hover:underline', 'dark:text-indigo-400', 'dark:hover:text-indigo-500', 'dark:hover:underline', 'transition', 'duration-500', 'ease-in-out');
                const handleViewAllClick = () => {
                    tableOfContentsPTags.forEach((pTag, i) => {
                        if (isViewAll && i > 3) {
                            pTag.classList.remove('hidden');
                            viewAllPTag.classList.add('hidden');
                        } else if (isViewLess && i > 3) {
                            pTag.classList.add('hidden');
                            pTag.scrollIntoView();
                            viewAllPTag.classList.remove('hidden');
                        }
                        });
                };
                pTagChildren.addEventListener('click', handleViewAllClick);
            }
        });
    }

    const formattedText = post.content.text.replace(/\\n/g, '\n\n');
    // console.log(formattedText);

    // const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [buttonText, setButtonText] = useState(false);

    const handlePause = () => {
        setIsPlaying(false);
        setIsPaused(true);
        
        const synth = window.speechSynthesis;
        if (synth.speaking) {
          synth.pause();
        }
      };

    const handlePlay = () => {
        setIsPlaying(true);
        setIsPaused(false);
        
        const synth = window.speechSynthesis;
        
        if (synth.paused) {
            synth.resume();
        } else {
        
            // const voices = synth.getVoices();
            // const voice = voices.find(voice => voice.name === "Google UK English Female");
            const utterance = new SpeechSynthesisUtterance([post.title, formattedText]);
            // setIsPlaying(true);
            utterance.onstart = () => setIsPlaying(true);
            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = () => setIsPlaying(false);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = 1;
            utterance.lang = 'en-US';
            utterance.voice = synth.getVoices()[1];
            utterance.voiceURI = 'native';
            utterance.currentTime = currentTime;
            synth.speak(utterance);
            // window.speechSynthesis.speak(utterance);
        }
    };
    
        useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
        }, []);

        const handleStop = () => {
            setIsPlaying(false);
            setIsPaused(false);
            const synth = window.speechSynthesis;
            synth.cancel();
        };

        const handleForward = () => {
            const synth = window.speechSynthesis;
            if (synth.speaking && !synth.paused) {
                const time = Math.min(currentTime + 10000, synth.getVoices()[1].utteranceLength);
                setCurrentTime(time);
                synth.cancel();
                handlePlay();
            }
        };
        
        const handleBackward = () => {
            const synth = window.speechSynthesis;
            if (synth.speaking && !synth.paused) {
                const time = Math.max(currentTime - 10000, 0);
                setCurrentTime(time);
                synth.cancel();
                handlePlay();
            }
        };
    
        const handleLinkedInClick  = () => {
            const articleUrl = encodeURIComponent(`https://progrmrslife.com/post/${post.slug}`);
            const articleTitle = encodeURIComponent(post.title);
            const redirectUri = encodeURIComponent(`https://progrmrslife.com/m/share/success?postId=${post.slug}`);
            const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?mini=true&url=${articleUrl}&title=${articleTitle}&redirect_uri=${redirectUri}`;

            // window.open(redirectUri, '_blank');
            // window.open(linkedInUrl, '_blank');

            const linkedInWindow = window.open(linkedInUrl, 'linkedin-share-dialog', 'width=626,height=436');
            const successWindow = window.open(`https://progrmrslife.com/m/share/success?postId=${post.slug}`, '_blank', 'width=1226,height=736');

            if ((!linkedInWindow || !successWindow) || (linkedInWindow.closed || successWindow.closed) || (typeof linkedInWindow.closed === 'undefined' || typeof successWindow.closed === 'undefined')) {
                // Display a message to the user asking them to enable popups for your website
                onEnablePopupMessage();
                linkedInWindow.close();
            } else if (!(!linkedInWindow || !successWindow) || !(linkedInWindow.closed || successWindow.closed) || !(typeof linkedInWindow.closed === 'undefined' || typeof successWindow.closed === 'undefined')) {
                successWindow.close();
            } else if (typeof linkedInWindow.closed === 'undefined' || typeof successWindow.closed === 'undefined') {
                successWindow.close();
            } else if (window.document.readyState === 'complete') {
                successWindow.close();
            } else {
                window.open(linkedInUrl, 'linkedIn-share-dialog', 'width=626,height=436');
            }
            if (!(typeof linkedInWindow.closed === 'undefined' || linkedInWindow.closed)) {
                window.setTimeout(function() {
                    window.open(`https://progrmrslife.com/m/share/success?postId=${post.slug}`, '_blank', 'width=1226,height=736');
                }, 20000);
            }

        };

        const handleFacebookClick = () => {
            const articleUrl = encodeURIComponent(`https://progrmrslife.com/post/${post.slug}`);
            const facebookAppId = '5864440530335233';
            const facebookUrl = `https://www.facebook.com/dialog/share?app_id=${facebookAppId}&display=popup&href=${articleUrl}&redirect_uri=https%3A%2F%2Fprogrmrslife.com%2Fm%2Fshare%2Fsuccess%3FpostId%3D${post.slug}`;

            // window.open(facebookUrl, '_blank');
            
            const facebookWindow = window.open(facebookUrl, 'facebook-share-dialog', 'width=626,height=436');
            const successWindow = window.open(`https://progrmrslife.com/m/share/success?postId=${post.slug}`, '_blank', 'width=1226,height=736');
            
            if ((!facebookWindow || !successWindow) || (facebookWindow.closed || successWindow.closed) || (typeof facebookWindow.closed === 'undefined' || typeof successWindow.closed === 'undefined')) {
                // Display a message to the user asking them to enable popups for your website
                onEnablePopupMessage();
                facebookWindow.close();
            } else if (!(!facebookWindow || !successWindow) || !(facebookWindow.closed || successWindow.closed) || !(typeof facebookWindow.closed === 'undefined' || typeof successWindow.closed === 'undefined')) {
                successWindow.close();
            } else if (typeof facebookWindow.closed === 'undefined' || typeof successWindow.closed === 'undefined') {
                successWindow.close();
            } else if (window.document.readyState === 'complete') {
                successWindow.close();
            } else {
                window.open(facebookUrl, 'facebook-share-dialog', 'width=626,height=436');
            }
            // if (!(typeof facebookWindow.closed === 'undefined' || facebookWindow.closed)) {
            //     window.setTimeout(function() {
            //         window.open(`https://progrmrslife.com/m/share/success?postId=${post.slug}`, '_blank', 'width=1226,height=736');
            //     }, 20000);
            // }
        };

        // const handleTwitterClick = () => {
        //     const articleUrl = encodeURIComponent(`https://progrmrslife.com/post/${post.slug}`);
        //     const articleTitle = encodeURIComponent(post.title);
        //     // const redirectUri = encodeURIComponent(`https://progrmrslife.com/m/share/success?postId=${post.slug}`);
        //     const twitterUrl = `https://twitter.com/intent/tweet?url=${articleUrl}&text=${articleTitle}&via=mindh4q3rr`;

            
        //     const twitterWindow = window.open(twitterUrl, 'twitter-share-dialog', 'width=626,height=436');
        //     const successWindow = window.open(`https://progrmrslife.com/m/share/success?postId=${post.slug}`, '_blank', 'width=1226,height=736');

        //     if ((!twitterWindow || !successWindow) || (twitterWindow.closed || successWindow.closed) || (typeof twitterWindow.closed === 'undefined' || typeof successWindow.closed === 'undefined')) {
        //         // Display a message to the user asking them to enable popups for your website
        //         onEnablePopupMessage();
        //         twitterWindow.close();
        //     } else if (!(!twitterWindow || !successWindow) || !(twitterWindow.closed || successWindow.closed) || !(typeof twitterWindow.closed === 'undefined' || typeof successWindow.closed === 'undefined')) {
        //         successWindow.close();
        //     } else if (typeof twitterWindow.closed === 'undefined' || typeof successWindow.closed === 'undefined') {
        //         successWindow.close();
        //     } else if (window.document.readyState === 'complete') {
        //         successWindow.close();
        //     } else {
        //         window.open(twitterUrl, 'twitter-share-dialog', 'width=626,height=436');
        //     }
        //     if (!(typeof twitterWindow.closed === 'undefined' || twitterWindow.closed)) {
        //         window.setTimeout(function() {
        //             window.open(`https://progrmrslife.com/m/share/success?postId=${post.slug}`, '_blank', 'width=1226,height=736');
        //         }, 20000);
        //     }

        // };

        const openTwitterShareWindow = (twitterUrl) => {
            const twitterWindow = window.open(twitterUrl, 'twitter-share-dialog', 'width=626,height=436');
            const successWindow = window.open(`https://progrmrslife.com/m/share/success?postId=${post.slug}`, '_blank', 'width=1226,height=736');
            
            if (!twitterWindow || !successWindow || twitterWindow.closed || successWindow.closed) {
                onEnablePopupMessage();
                twitterWindow?.close();
            } else {
                successWindow.close();
            }
            
            if (!twitterWindow?.closed) {
                window.setTimeout(() => {
                    window.open(`https://progrmrslife.com/m/share/success?postId=${post.slug}`, '_blank', 'width=1226,height=736');
                }, 20000);
            }
        };
            
        const handleTwitterClick = () => {
            const articleUrl = encodeURIComponent(`https://progrmrslife.com/post/${post.slug}`);
            const articleTitle = encodeURIComponent(post.title);
            const twitterUrl = `https://twitter.com/intent/tweet?url=${articleUrl}&text=${articleTitle}&via=mindh4q3rr`;
            
            openTwitterShareWindow(twitterUrl);
        };

        const handleCopyClick = () => {
            onCopyToClipboard();
        };

        useEffect(() => {
            if (isCopied) {
                setButtonText(true);
                setTimeout(() => {
                setButtonText(false);
                }, 2000);
            } else {
                setButtonText(false);
            }
        }, [isCopied]);


        const getMinutesRead = (text) => {
            const cleanedText = text.replace(/({[^}]*}|\[[^\]]*])/g, '');
            const words = cleanedText.split(' ').length;
            const wordsPerMinute = 60;
            const minutes = Math.round(words / wordsPerMinute);
            return minutes;
        };
    
    const BsPlayFill = () => {
        return (
            <Tooltip content="Listen to this article" placement="top" style="dark" className="transition duration-700 ease-in-out">
            <button
            onClick={handlePlay}
            className='flex ml-3 mt-1'
            >
                <div className="relative">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 text-green-500 hover:text-black dark:text-green-400 dark:hover:text-white transition duration-700 ease-in-out rounded-full"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm2.8 8.51l-3.69 2.46a.62.62 0 0 1-.96-.5V5.53a.62.62 0 0 1 .96-.51l3.7 2.46a.62.62 0 0 1 0 1.02z" fill="currentColor"></path></svg>
                    <div className='w-full h-full rounded-full align-middle absolute top-0 hover:bg-green-400 hover:bg-opacity-50 hover:animate-ping bg-green-400 dark:hover:bg-green-400 bg-opacity-50 animate-ping-slow cursor-pointer'></div>
                </div>
                <span className='text-gray-700 dark:text-gray-200 ml-1 mb-1 text-sm font-semibold'>{isPlaying ? "Listening..." : "Listen"}</span>
            </button>
            
            </Tooltip>
        )
    }
    
    const BsPauseFill = () => {
        return (
            <Tooltip content="Pause the speech" placement="top" style="dark" className="transition duration-700 ease-in-out">
            <button
            onClick={handlePause}
            className='flex ml-3 mt-1'
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 text-green-500 hover:text-black hover:animate-bounce dark:text-green-400 dark:hover:text-white transition duration-700 ease-in-out rounded-full"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM6.77 10.46a.62.62 0 1 1-1.23 0V5.54a.62.62 0 0 1 1.23 0v4.92zm3.7 0a.62.62 0 1 1-1.24 0V5.54a.62.62 0 0 1 1.23 0v4.92z" fill="currentColor"></path></svg>
                <span className='text-gray-700 dark:text-gray-200 ml-1 mb-1 text-sm font-semibold'>{isPlaying ? "Listening..." : "Listen"}</span>
            </button>
            
            </Tooltip>
        )
    }
    
    const BsStopFill = () => {
        return (
            <Tooltip content="Stop the speech" placement="right" style="dark" className="transition duration-700 ease-in-out">
            &nbsp;•&nbsp;
            <button onClick={handleStop} className="mr-1 mt-1 cursor-pointer">
                <svg className='h-4 w-4 text-green-500 hover:text-black hover:animate-bounce dark:text-green-400 dark:hover:text-white transition duration-700 ease-in-out rounded-full' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="24" height="24">
                    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" fill="none" />
                    <rect x="9" y="9" width="6" height="6" fill="currentColor" />
                </svg>
            </button>
            
            </Tooltip>
        )
    }
    
    const BsBackwardFill = () => {
        return (
            <Tooltip content="Backward the speech" placement="right" style="dark" className="transition duration-700 ease-in-out">
                &nbsp;•&nbsp;<button onClick={handleBackward} className="mr-1 cursor-pointer">-10s</button>
            </Tooltip>
        )
    }
    
    const BsForwardFill = () => {
        return (
            <Tooltip content="Forward the speech" placement="right" style="dark" className="transition duration-700 ease-in-out">
                &nbsp;•&nbsp;<button onClick={handleForward} className="mr-1 cursor-pointer">+10s</button>
            </Tooltip>
        )
    }

    const BsFacebook = () => {
        return (
            <Tooltip content="Share on Facebook" placement="top" style="dark" className="transition duration-700 ease-in-out">
            <button onClick={handleFacebookClick} className="mr-3 cursor-pointer">
                <div className='relative'>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="h-5 w-5 text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white transition duration-700 ease-in-out" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"></path></svg>
                    <div className='w-full h-full rounded-full align-middle absolute top-0 hover:bg-blue-600 bg-opacity-50 hover:animate-ping'></div>
                </div>
            </button>
            </Tooltip>
        )
    }
        
        
        const BsTwitter = () => {
        return (
            <Tooltip content="Tweet this post" placement="top" style="dark" className="transition duration-700 ease-in-out">
                <button onClick={handleTwitterClick} className="mr-3 ml-3 cursor-pointer">                
                    <div className='relative'>
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="h-5 w-5 text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white transition duration-700 ease-in-out" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"></path></svg>
                        <div className='w-full h-full rounded-full align-middle absolute top-0 hover:bg-sky-400 bg-opacity-50 hover:animate-ping'></div>
                    </div>
                </button>
            </Tooltip>
        )
        }
        
        const BsLinkedIn = () => {
        return (
            <Tooltip content="Share on LinkedIn" placement="top" style="dark" className="transition duration-700 ease-in-out">
                <button onClick={ handleLinkedInClick } className="mr-3 mt-1 cursor-pointer">
                    <div className='relative'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6 text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white transition duration-700 ease-in-out rounded-full" viewBox="0 2 67 70">
                            <path fillRule="evenodd" clipRule="evenodd" fill="currentColor" d="M50.837,48.137V36.425c0-6.275-3.35-9.195-7.816-9.195  c-3.604,0-5.219,1.983-6.119,3.374V27.71h-6.79c0.09,1.917,0,20.427,0,20.427h6.79V36.729c0-0.609,0.044-1.219,0.224-1.655  c0.49-1.22,1.607-2.483,3.482-2.483c2.458,0,3.44,1.873,3.44,4.618v10.929H50.837z M22.959,24.922c2.367,0,3.842-1.57,3.842-3.531  c-0.044-2.003-1.475-3.528-3.797-3.528s-3.841,1.524-3.841,3.528c0,1.961,1.474,3.531,3.753,3.531H22.959z M34,64  C17.432,64,4,50.568,4,34C4,17.431,17.432,4,34,4s30,13.431,30,30C64,50.568,50.568,64,34,64z M26.354,48.137V27.71h-6.789v20.427  H26.354z"/>
                        </svg>
                        <div className='w-full h-full rounded-full align-middle absolute top-0 hover:bg-blue-800 bg-opacity-50 hover:animate-ping'></div>
                    </div>
                </button>
            </Tooltip>
        )
        }
        
    const BsLink = () => {
        return (
            <Tooltip content={ buttonText ? 'Link copied to clipboard!' : 'Copy link' } placement="top" style="dark" className="transition duration-700 ease-in-out">
                <button onClick={handleCopyClick} className="mr-3 cursor-pointer">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className='h-6 w-6 text-gray-400 hover:text-black hover:animate-bounce dark:text-gray-400 dark:hover:text-white transition duration-700 ease-in-out'>
                        <path fillRule="evenodd" clipRule="evenodd" d="M3.57 14.67c0-.57.13-1.11.38-1.6l.02-.02v-.02l.02-.02c0-.02 0-.02.02-.02.12-.26.3-.52.57-.8L7.78 9v-.02l.01-.02c.44-.41.91-.7 1.44-.85a4.87 4.87 0 0 0-1.19 2.36A5.04 5.04 0 0 0 8 11.6L6.04 13.6c-.19.19-.32.4-.38.65a2 2 0 0 0 0 .9c.08.2.2.4.38.57l1.29 1.31c.27.28.62.42 1.03.42.42 0 .78-.14 1.06-.42l1.23-1.25.79-.78 1.15-1.16c.08-.09.19-.22.28-.4.1-.2.15-.42.15-.67 0-.16-.02-.3-.06-.45l-.02-.02v-.02l-.07-.14s0-.03-.04-.06l-.06-.13-.02-.02c0-.02 0-.03-.02-.05a.6.6 0 0 0-.14-.16l-.48-.5c0-.04.02-.1.04-.15l.06-.12 1.17-1.14.09-.09.56.57c.02.04.08.1.16.18l.05.04.03.06.04.05.03.04.04.06.1.14.02.02c0 .02.01.03.03.04l.1.2v.02c.1.16.2.38.3.68a1 1 0 0 1 .04.25 3.2 3.2 0 0 1 .02 1.33 3.49 3.49 0 0 1-.95 1.87l-.66.67-.97.97-1.56 1.57a3.4 3.4 0 0 1-2.47 1.02c-.97 0-1.8-.34-2.49-1.03l-1.3-1.3a3.55 3.55 0 0 1-1-2.51v-.01h-.02v.02zm5.39-3.43c0-.19.02-.4.07-.63.13-.74.44-1.37.95-1.87l.66-.67.97-.98 1.56-1.56c.68-.69 1.5-1.03 2.47-1.03.97 0 1.8.34 2.48 1.02l1.3 1.32a3.48 3.48 0 0 1 1 2.48c0 .58-.11 1.11-.37 1.6l-.02.02v.02l-.02.04c-.14.27-.35.54-.6.8L16.23 15l-.01.02-.01.02c-.44.42-.92.7-1.43.83a4.55 4.55 0 0 0 1.23-3.52L18 10.38c.18-.21.3-.42.35-.65a2.03 2.03 0 0 0-.01-.9 1.96 1.96 0 0 0-.36-.58l-1.3-1.3a1.49 1.49 0 0 0-1.06-.42c-.42 0-.77.14-1.06.4l-1.2 1.27-.8.8-1.16 1.15c-.08.08-.18.21-.29.4a1.66 1.66 0 0 0-.08 1.12l.02.03v.02l.06.14s.01.03.05.06l.06.13.02.02.01.02.01.02c.05.08.1.13.14.16l.47.5c0 .04-.02.09-.04.15l-.06.12-1.15 1.15-.1.08-.56-.56a2.3 2.3 0 0 0-.18-.19c-.02-.01-.02-.03-.02-.04l-.02-.02a.37.37 0 0 1-.1-.12c-.03-.03-.05-.04-.05-.06l-.1-.15-.02-.02-.02-.04-.08-.17v-.02a5.1 5.1 0 0 1-.28-.69 1.03 1.03 0 0 1-.04-.26c-.06-.23-.1-.46-.1-.7v.01z" fill="currentColor">
                        </path>
                    </svg>
                </button>
            </Tooltip>
        )
    }
    const LeaveComment = () => {
        return (
            <Tooltip content="Leave a Comment, We're excited to hear from you!😍" placement="top" style="dark" className="transition duration-700 ease-in-out">
                <button className="mr-3 cursor-pointer">
                    <a href={`/post/${post.slug}#commentForm`}>
                        <div className='relative'>
                            <FaComment className="h-6 w-6 text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white transition duration-700 ease-in-out" />
                            <div className='w-full h-full rounded-full align-middle absolute top-0 hover:bg-slate-400 dark:hover:bg-white bg-opacity-50 hover:animate-ping'></div>
                        </div>
                    </a>
                </button>
            </Tooltip>
        )
    }

    // const getContentFragment = (index, text, obj, type) => {
    // let modifiedText = text;

    // if (obj) {
    //     if (obj.bold) {
    //     modifiedText = (<b key={index}>{text}</b>);
    //     }

    //     if (obj.italic) {
    //     modifiedText = (<em key={index}>{text}</em>);
    //     }

    //     if (obj.underline) {
    //     modifiedText = (<u key={index}>{text}</u>);
    //     }
        
    //     if (obj.code) {
    //         modifiedText = (<code key={index}>{text}</code>);
    //     }
        
    //     if (obj.strikethrough) {
    //         modifiedText = (<del key={index}>{text}</del>);
    //     }
        
    //     if (obj.subscript) {
    //         modifiedText = (<sub key={index}>{text}</sub>);
    //     }
        
    //     if (obj.superscript) {
    //         modifiedText = (<sup key={index}>{text}</sup>);
    //     }
        
    //     if (obj.link) {
    //         modifiedText = (<a href={obj.href} key={index}>{text}</a>);
    //     }
    //     if (obj.image) {
    //         modifiedText = (<img src={obj.image} key={index} alt={obj.alt} />);
    //     }
    //     if (obj.quote) {
    //         modifiedText = (<blockquote key={index}>{text}</blockquote>);
    //     }
    //     if (obj.list) {
    //         modifiedText = (<ul key={index}>{text}</ul>);
    //     }
    //     if (obj.listitem) {
    //         modifiedText = (<li key={index}>{text}</li>);
    //     }
    //     if (obj.table) {
    //         modifiedText = (<table key={index}>{text}</table>);
    //     }
    //     if (obj.tablecell) {
    //         modifiedText = (<td key={index}>{text}</td>);
    //     }
    //     if (obj.tableheader) {
    //         modifiedText = (<th key={index}>{text}</th>);
    //     }
    //     if (obj.tablefooter) {
    //         modifiedText = (<tfoot key={index}>{text}</tfoot>);
    //     }
    //     if (obj.paragraph) {
    //         modifiedText = (<p key={index}>{text}</p>);
    //     }
    //     if (obj.heading) {
    //         modifiedText = (<h1 key={index}>{text}</h1>);
    //     }
    //     if (obj.heading2) {
    //         modifiedText = (<h2 key={index}>{text}</h2>);
    //     }
    //     if (obj.heading3) {
    //         modifiedText = (<h3 key={index}>{text}</h3>);
    //     }
    //     if (obj.heading4) {
    //         modifiedText = (<h4 key={index}>{text}</h4>);
    //     }
    //     if (obj.heading5) {
    //         modifiedText = (<h5 key={index}>{text}</h5>);
    //     }
    //     if (obj.heading6) {
    //         modifiedText = (<h6 key={index}>{text}</h6>);
    //     }
    //     if (obj.orderedlist) {
    //         modifiedText = (<ol key={index}>{text}</ol>);
    //     }
    //     if (obj.unorderedlist) {
    //         modifiedText = (<ul key={index}>{text}</ul>);
    //     }
    // }

    // switch (type) {
    //     case 'heading-three':
    //     return <h3 key={index} className="text-xl font-semibold mb-4">{modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}</h3>;
    //     case 'paragraph':
    //         if (modifiedText.map((item, i) => item === 'text')) {
    //             return <p key={index} className="mb-8">{modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}</p>;
    //         } else if (modifiedText.map((item, i) => item === 'href')) {
    //             return <a href={item[1]} key={index} className="mb-8">{modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}</a>;
    //         }
    //         break;
    //     case 'heading-four':
    //     return <h4 key={index} className="text-md font-semibold mb-4">{modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}</h4>;
    //     case 'image':
    //     return (
    //         <img
    //         key={index}
    //         alt={obj.title}
    //         height={obj.height}
    //         width={obj.width}
    //         src={obj.src}
    //         />
    //     );
    //     default:
    //     return modifiedText;
    // }
    // };



    const [placeAdUnit, setPlaceAdUnit] = useState(false);
    useEffect(() => {
        setPlaceAdUnit(true);
    }, []);


    const [showPopup, setShowPopup] = useState(false);
    const [isValidAdLink, setIsValidAdLink] = useState(false);
    const modalRef = useRef(null);

    const handlePopupClose = () => {
        setShowPopup(false);
    };

    // function verifyAdLink(enteredLink) {
    //     // Get all <ins> elements
    //     const adsArray = document.getElementsByTagName('ins');
    //     console.log('verifyAdLink(): adsArray:', adsArray);
        
    //     // Initialize an empty array to store links
    //     const linksArray = [];
        
    //     // Loop through each <ins> element
    //     for (let i = 0; i < adsArray.length; i++) {
    //         const adElement = adsArray[i];
            
    //         // Check if the <ins> element contains a child iframe
    //         const iframeChild = adElement.querySelector('iframe');
    //         if (iframeChild) {
    //             try {
    //                 // Extract the contentDocument from the iframe
    //                 const iframeDocument = iframeChild.contentDocument || iframeChild.contentWindow.document;
    //                 console.log('verifyAdLink(): iframeDocument:', iframeDocument);
    //                 // Proceed with extracting links
    //             } catch (error) {
    //                 console.log('Error accessing iframe content:', error);
    //                 continue; // Skip this iframe and move to the next one
    //             }
                
    //             // Get all <a> tags inside the iframe document
    //             const anchorTags = iframeDocument.getElementsByTagName('a');
    //             console.log('verifyAdLink(): anchorTags:', anchorTags);
                
    //             if (anchorTags.length === 0) {
    //                 console.log('No <a> tags found within the iframe.');
    //                 continue; // Skip this iframe and move to the next one
    //             }
                
    //             // Loop through each <a> tag
    //             for (let j = 0; j < anchorTags.length; j++) {
    //                 const anchorElement = anchorTags[j];
    //                 // Extract the href attribute from the <a> tag
    //                 const href = anchorElement.getAttribute('href');
    //                 if (href) {
    //                     // Push the extracted link into the linksArray
    //                     linksArray.push(href);
    //                 }
    //             }
    //         }
    //     }
        
    //     // Log the extracted links
    //     console.log('verifyAdLink(): linksArray:', linksArray);
        
    //     // Check if the entered link matches any of the extracted links
    //     const validAdLink = linksArray.includes(enteredLink); // Returns true or false, depending on whether the entered link is found in the linksArray
    //     console.log('Is Valid Ad Link:', validAdLink);

    //     return validAdLink;
    // }

    // const handleAdLinkEntered = (link) => {
    //     // console.log("handleAdLinkEntered(): Link: ", link);
    //     // Check if the entered link matches the format of a Google Ad link
    //     const adLinkPattern1 = /https:\/\/www\.googleadservices\.com\/pagead\/aclk.*sa=L&ai=.+/i;
    //     const adLinkPattern2 = /\?gclid=/i;
    //     const validAdLink = adLinkPattern1.test(link) || adLinkPattern2.test(link); // Returns true or false, depending on whether the entered link matches the pattern1 or the pattern2
    //     // sa=L is a required parameter in the Google Ad link. 
    //     // sa: Source Ad is required for the ad to be valid and trackable. L: Link.
    //     // nis: Number of ad impressions served. 4: 4 impressions served.
    //     // ai: Ad ID. The ai parameter is the ad ID. It is a unique identifier for the ad.
    //     // const validAdLink = verifyAdLink(link);
    //     // console.log("handleAdLinkEntered(): validAdLink: ", validAdLink);
    //     setIsValidAdLink(validAdLink);
        
    //     if (validAdLink) {
    //         setShowPopup(false); // Close the popup
    //         // Display a success message
    //         toast.success('Great! Your ad link has been successfully added.', {
    //             position: "top-center",
    //             duration: 6000,
    //             style: {backgroundColor: '#111827', color: '#F3F4F6'}
    //         });
    //     } else {
    //         // Display an error message or handle invalid link
    //         toast.error('Invalid Ad Link! Please enter a valid Google Ad link.', {
    //             position: "top-right",
    //             duration: 6000,
    //             style: {backgroundColor: '#111827', color: '#F3F4F6'}
    //         });
    //     }
    // };

    // useEffect(() => {
    //     // Add event listener to handle ESC key press to close the modal
    //     const handleKeyPress = (event) => {
    //         if (event.key === 'Escape') {
    //             setShowPopup(false);
    //         }
    //     };

    //     const handleOutsideClick = (event) => {
    //         if (modalRef.current && !modalRef.current.contains(event.target)) {
    //             setShowPopup(false);
    //         }
    //     };

    //     if (showPopup) {
    //         // document.body.style.overflow = 'hidden'; // Prevent scrolling
    //         document.addEventListener('keydown', handleKeyPress);
    //         document.addEventListener('mousedown', handleOutsideClick);
    //     } else {
    //         // document.body.style.overflow = ''; // Re-enable scrolling
    //         document.removeEventListener('keydown', handleKeyPress);
    //         document.removeEventListener('mousedown', handleOutsideClick);
    //     }

    //     // Cleanup function
    //     return () => {
    //         // document.body.style.overflow = ''; // Re-enable scrolling on component unmount
    //         document.removeEventListener('keydown', handleKeyPress);
    //         document.removeEventListener('mousedown', handleOutsideClick);
    //     };
    // }, [showPopup]);


    return (
        <>
            <Head>
                <title>{`${post.title} — ${
                    // Get the current year from Date + one month (For example, if the current month is December, the year will be next year)
                    new Date().getFullYear() + (new Date().getMonth() === 11 ? 1 : 0) // If the current month is December, add 1 to the current year to get the next year
                } | Programmers Life`}</title>
                <meta name="description" content={post.excerpt} />
                <meta name="keywords" content={post.categories.map((category) => category.name).join(', ')} />
                <meta name="author" content={post.author.name} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:image" content={post.featuredImage.url} />
                <meta property="og:url" content={`https://www.progrmrslife.com/post/${post.slug}`} />
                <meta property="og:type" content="article" />
                <meta property="og:site_name" content="ProgrmrsLife" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.title} />
                <meta name="twitter:description" content={post.excerpt} />
                <meta name="twitter:image" content={post.featuredImage.url} />
                <meta name="twitter:site" content="@mindh4q3rr" />
                <meta name="twitter:creator" content="@mindh4q3rr" />
                <link rel="canonical" href={`https://www.progrmrslife.com/post/${post.slug}`} />
                <meta property="article:published_time" content={post.createdAt} />
                <meta property="article:modified_time" content={post.updatedAt} />
                <meta property="article:author" content={post.author.name} />
                <meta property="article:section" content={post.categories[0].name} />
                <meta property="article:tag" content={post.categories.map((category) => category.name).join(', ')} />
                <meta name="robots" content="index, follow" />
                <meta name="googlebot" content="index, follow" />
                <link rel="alternate" type="application/rss+xml" title="Programmers Life RSS Feed" href="https://progrmrslife.com/rss.xml" />
            </Head>
            <Script id="schema-script" type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": post.title,
                    "image": post.featuredImage.url,
                    "author": {
                    "@type": "Person",
                    "name": post.author.name
                    },
                    "publisher": {
                    "@type": "Organization",
                    "name": "ProgrmrsLife",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://www.progrmrslife.com/imgs/logo.png"
                    }
                    },
                    "datePublished": post.createdAt,
                    "dateModified": post.updatedAt,
                    "description": post.excerpt,
                    "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": `https://www.progrmrslife.com/post/${post.slug}`
                    }
                })}
            </Script>
            <motion.div
                initial="initial"
                animate="animate"
                variants={{
                initial: { opacity: 0 },
                animate: { opacity: 1 }
                }}
                transition={{ duration: 0.5 }}
            >
                <article className="post-detail">
                    <AdsenseScript />
                    <motion.div className="mb-8" variants={fadeInUp}>
                        {
                            placeAdUnit && (
                                <>
                                    {/* <!-- Recommended-ad-unit --> */}
                                    {/* <ins className="adsbygoogle"
                                    style={{ display: 'block' }}
                                    data-ad-client="ca-pub-1339539882255727"
                                    data-ad-slot="9618957531"
                                    data-ad-format="auto"
                                    data-full-width-responsive="true"></ins> */}

                                    {/* <!-- Recommended-ad-unit --> */}
                                    <ins className="adsbygoogle"
                                    style={{ display: 'block' }}
                                    data-ad-client="ca-pub-5021308603136043"
                                    data-ad-slot="3167248456"
                                    data-ad-format="auto"
                                    data-full-width-responsive="true"></ins>
                                </>
                            )
                        }
                    </motion.div>
                    <motion.div className="relative overflow-hidden shadow-xl mb-6 cursor-pointer transition duration-700 ease-in-out transform hover:opacity-80" variants={fadeInUp}>
                        <figure className="featured-image">
                            <Image
                                src={post.featuredImage.url}
                            alt={post.title}
                            width={1200}
                            height={630}
                            layout="responsive"
                            loading="lazy"
                            className="object-cover w-full h-full rounded-t-lg hover:shadow-inner"
                        />
                        </figure>
                    </motion.div>
                    <motion.div className="px-4 lg:px-0" variants={fadeInUp}>
                        <header className="post-header">
                            <Breadcrumbs categories={post.categories} title={post.title} />

                            <div className="post-meta lg:flex block items-center justify-center mb-4 w-full px-2 gap-4">
                                <Link href={`/post/${post.slug}#authorBio`}>
                                    <address className="author flex items-center justify-center mb-4 lg:mb-0 w-full lg:w-auto mr-2">
                                        <div className='relative w-[30px] h-[30px]'>
                                            <Image
                                                alt={post.author.name}
                                                fill
                                                src={post.author.photo.url}
                                                className="author-image rounded-full align-middle border-none shadow-lg cursor-pointer object-cover"
                                                loading="lazy"
                                            />
                                            <div className='absolute inset-0 rounded-full hover:bg-purple-500 hover:bg-opacity-50 hover:animate-ping bg-purple-400 dark:hover:bg-purple-400 bg-opacity-50 animate-ping-slow cursor-pointer'></div>
                                        </div>
                                        <p className="author-name inline align-middle text-gray-700 dark:text-gray-200 ml-2 text-lg cursor-pointer">{post.author.name}</p>
                                    </address>
                                </Link>
                                <div className="flex items-center justify-center gap-4 w-full lg:w-auto font-medium text-gray-700 dark:text-gray-200">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <time className='mr-2' dateTime={post.createdAt}>
                                            {moment(post.createdAt).format('MMMM Do YYYY')}
                                        </time>
                                    </div>
                                        {/* &nbsp;•&nbsp; */}
                                    <div>    
                                        <span>
                                            {/* <svg width="30px" height="30px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2 text-pink-300" fill="none" stroke="currentColor" transform="rotate(90)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M512 919.04c-224.768 0-407.04-182.272-407.04-407.04S287.232 104.96 512 104.96s407.04 182.272 407.04 407.04-182.272 407.04-407.04 407.04z m0-15.36c216.064 0 391.68-175.616 391.68-391.68S728.064 120.32 512 120.32 120.32 295.936 120.32 512s175.616 391.68 391.68 391.68z" fill=""></path><path d="M512 837.12c-179.712 0-325.12-145.408-325.12-325.12S332.288 186.88 512 186.88s325.12 145.408 325.12 325.12-145.408 325.12-325.12 325.12z m0-15.36c171.008 0 309.76-138.752 309.76-309.76S683.008 202.24 512 202.24 202.24 340.992 202.24 512s138.752 309.76 309.76 309.76z" fill=""></path><path d="M501.76 245.76h20.48c5.632 0 10.24 4.608 10.24 10.24v81.92c0 5.632-4.608 10.24-10.24 10.24h-20.48c-5.632 0-10.24-4.608-10.24-10.24V256c0-5.632 4.608-10.24 10.24-10.24zM714.24 328.192c3.072 3.072 3.072 7.68 0 10.752l-32.768 32.768c-3.072 3.072-7.68 3.072-10.752 0-3.072-3.072-3.072-7.68 0-10.752l32.768-32.768c3.072-3.072 8.192-3.072 10.752 0zM366.08 655.872c3.072 3.072 3.072 7.68 0 10.752l-32.768 32.768c-3.072 3.072-7.68 3.072-10.752 0-3.072-3.072-3.072-7.68 0-10.752l32.768-32.768c3.072-3.072 8.192-3.072 10.752 0zM650.752 655.872c3.072-3.072 7.68-3.072 10.752 0l32.768 32.768c3.072 3.072 3.072 7.68 0 10.752-3.072 3.072-7.68 3.072-10.752 0l-32.768-32.768c-3.072-3.072-3.072-8.192 0-10.752zM353.28 501.76v20.48c0 5.632-4.608 10.24-10.24 10.24H261.12c-5.632 0-10.24-4.608-10.24-10.24v-20.48c0-5.632 4.608-10.24 10.24-10.24h81.92c5.632 0 10.24 4.608 10.24 10.24zM501.76 675.84h20.48c5.632 0 10.24 4.608 10.24 10.24v81.92c0 5.632-4.608 10.24-10.24 10.24h-20.48c-5.632 0-10.24-4.608-10.24-10.24v-81.92c0-5.632 4.608-10.24 10.24-10.24zM773.12 501.76v20.48c0 5.632-4.608 10.24-10.24 10.24h-81.92c-5.632 0-10.24-4.608-10.24-10.24v-20.48c0-5.632 4.608-10.24 10.24-10.24h81.92c5.632 0 10.24 4.608 10.24 10.24zM515.584 473.088h0.512L395.264 317.952c-3.072-4.608-9.728-5.12-14.336-1.536l-24.064 18.944c-4.608 3.584-5.12 9.728-1.536 14.336l120.32 154.624c4.096-17.92 20.48-31.232 39.936-31.232z" fill="#7ED321"></path><path d="M519.68 463.872L401.408 312.32c-3.072-3.584-7.168-6.144-11.776-6.656-5.12-0.512-9.728 0.512-13.824 3.584l-24.064 18.944c-8.192 6.144-9.216 16.896-3.072 25.088l115.712 148.992c-0.512 3.072-1.024 6.656-1.024 9.728 0 26.624 22.016 48.64 48.64 48.64s48.64-22.016 48.64-48.64c0-24.064-17.408-44.544-40.96-48.128z m-158.72-119.808c-0.512-0.512-1.536-2.048 0-3.584l24.064-18.944c1.024-0.512 1.536-0.512 2.048-0.512 1.024 0 1.024 0 1.536 0.512l111.616 143.36c-11.776 3.072-22.016 10.752-28.672 20.48L360.96 344.064z m151.04 201.216c-14.336 0-26.624-9.216-31.232-22.016-1.024-3.584-2.048-7.168-2.048-11.264 0-4.608 1.024-9.216 2.56-13.312 5.12-11.264 15.872-19.456 29.184-19.968h1.024c13.824 0 25.6 8.192 30.72 19.968 1.536 4.096 2.56 8.704 2.56 13.312 0.512 18.432-14.336 33.28-32.768 33.28z" fill=""></path></g></svg> */}
                                            <svg width="30px" height="30px" viewBox="0 0 24 24" className="h-6 w-6 inline mr-2 text-pink-300" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                                <g id="SVGRepo_iconCarrier"> 
                                                    <path d="M17 7L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> 
                                                    <path d="M10 3H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> 
                                                    <circle cx="12" cy="13" r="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></circle> 
                                                    <path d="M12 13V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> 
                                                </g>
                                            </svg>
                                        </span>
                                        <span className='read-time text-gray-700 dark:text-gray-200'>
                                            {getMinutesRead(post.content.text)} min read
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <nav className='post-actions sm:flex flex items-center justify-center mb-8 px-2'>
                                <LeaveComment />
                                &nbsp;•&nbsp;
                                <BsTwitter />
                                <BsFacebook />
                                <BsLinkedIn />
                                <BsLink />
                                &nbsp;•&nbsp;
                                {isPlaying ? <BsPauseFill /> : <BsPlayFill />}
                                {isPlaying &&
                                    <span className='flex-col text-xs lg:text-md text-gray-700 dark:text-gray-200'>
                                        <BsStopFill />
                                        <BsBackwardFill />
                                        <BsForwardFill />
                                    </span>
                                }
                            </nav>
                            <h1 className='post-title mb-8 mt-4 text-3xl font-semibold'>
                                {post.title} — {
                                    // Get the current year from Date + one month (For example, if the current month is December, the year will be next year)
                                    new Date().getFullYear() + (new Date().getMonth() === 11 ? 1 : 0) // If the current month is December, add 1 to the current year to get the next year
                                }
                            </h1>
                        </header>
                        <div className="my-8">
                            {
                                placeAdUnit && (
                                    <>
                                        {/* <!-- Recommended-ad-unit --> */}
                                        {/* <ins className="adsbygoogle"
                                        style={{ display: 'block' }}
                                        data-ad-client="ca-pub-1339539882255727"
                                        data-ad-slot="9618957531"
                                        data-ad-format="auto"
                                        data-full-width-responsive="true"></ins> */}

                                        {/* <!-- Recommended-ad-unit --> */}
                                        <ins className="adsbygoogle"
                                        style={{ display: 'block' }}
                                        data-ad-client="ca-pub-5021308603136043"
                                        data-ad-slot="3167248456"
                                        data-ad-format="auto"
                                        data-full-width-responsive="true"></ins>
                                    </>
                                )
                            }
                        </div>

                        {/* {console.log(post.content.json.children)} */}
                        {/* {post.content.json.children[0].children[0].text} */}
                        
                        
                        {/* {post.content.json.children.map((typeObj, index) => {
                            const children = typeObj.children.map((item, itemIndex) =>  item.text)
                            return console.log(children)
                            // return children
                        })} */}

                        {/* {post.content.raw.children.map((typeObj, index) => {
                            const children = typeObj.children.map((item, itemIndex) => getContentFragment(itemIndex, item.text, item)) 
                            return getContentFragment(index, children, typeObj, typeObj.type)
                        })} */}

                        <section className='post-content'>
                            <RichText
                                content={post.content.json.children}
                                renderers={{
                                a: ({ children, openInNewTab, href, rel, ...rest }) => {
                                    if (href.match(/^https?:\/\/|^\/\//i)) {
                                    return (
                                            <Link
                                            className='text-indigo-700 hover:text-pink-300 dark:hover:text-pink-300 cursor-pointer dark:text-indigo-500 transition duration-500'
                                            href={href}
                                            target={openInNewTab ? '_blank' : '_self'}
                                            rel={rel || 'noopener noreferrer'}
                                            {...rest}
                                            >
                                                {children}

                                            </Link>
                                    );
                                    }

                                    return (
                                            <Link href={href}>
                                                <a {...rest}>{children}</a>
                                            </Link>
                                    );
                                },
                                h1: ({ children }) => <h1 className="text-3xl font-semibold">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-1xl font-semibold">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-xl font-semibold">{children}</h3>,
                                h4: ({ children }) => <h4 className="text-xl font-semibold my-4">{children}</h4>,
                                h5: ({ children }) => <h5 className="text-gray-700 dark:text-gray-300 font-semibold">{children}</h5>,
                                h6: ({ children }) => <h6 className="text-gray-700 dark:text-gray-300 font-semibold">{children}</h6>,
                                p: ({ children }) => <p className="mb-8 text-gray-900 dark:text-gray-400">{children}</p>,
                                bold: ({ children }) => <span className="font-semibold text-sm text-gray-900 dark:text-gray-400">{children}</span>,
                                italic: ({ children }) => <em className="post-detail-em relative text-gray-900 dark:text-white mr-0">{children}</em>,
                                code: ({ children }) => <code className="bg-gray-200 dark:bg-gray-600 px-2 py-0 rounded font-mono text-sm text-gray-900 dark:text-gray-100">{children}</code>,
                                code_block:
                                    ({ children }) => {
                                    const CodeBlock = () => {
                                        const [preContent, setPreContent] = useState("");

                                        useEffect(() => {
                                            const childArray = React.Children.toArray(children);
                                                
                                            let content = "";
                                            for (let i = 0; i < childArray.length; i++) {
                                            const child = childArray[i];
                                            if (child.props && child.props.content && Array.isArray(child.props.content)) {
                                                const text = child.props.content.reduce((acc, cur) => acc + cur.text, "");
                                                content += text;
                                            } else if (typeof child === "string") {
                                                content += child;
                                            } else if (child.props && child.props.content.children) {
                                                const grandchildArray = React.Children.toArray(child.props.content.children);
                                                for (let j = 0; j < grandchildArray.length; j++) {
                                                const grandchild = grandchildArray[j].props.content[0].children[0].text;
                                                if (typeof grandchild === "string") {
                                                    content += grandchild;
                                                }
                                                }
                                            }
                                            }
                                            setPreContent(content);
                                        }, []);

                                        return (
                                            <div>
                                                <Prism
                                                    language="javascript"
                                                    getPrismTheme={(_theme, colorScheme) =>
                                                    colorScheme === "dark" ? duotoneLight : duotoneDark
                                                    }
                                                    className="m-2 sm:max-w-lg max-w-xs overflow-x-auto"
                                                >
                                                    {preContent}
                                                </Prism>
                                            </div>
                                        );
                                    }

                                    return <CodeBlock />;
                                }
                                ,
                                blockquote: ({ children }) => {
                                    return (
                                        <blockquote className="mb-8 italic text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow-gray-200 dark:shadow-gray-700 shadow-inner">
                                        {children}
                                        </blockquote>
                                    );
                                },
                                class: ({ children, className }) => {
                                    // const childArray = React.Children.toArray(children);
                                    // const isWaitingBlock = childArray.map(child => child.props.parent.className === 'waiting-block')
                                    // console.log(className);
                                    const subtitleClasses = ['subtitle-1', 'subtitle-2', 'subtitle-3', 'subtitle-4', 'subtitle-5', 'subtitle-6', 'subtitle-7', 'subtitle-8', 'subtitle-9', 'subtitle-10', 'subtitle-11', 'subtitle-12', 'subtitle-13', 'subtitle-14', 'subtitle-15', 'subtitle-16', 'subtitle-17', 'subtitle-18', 'subtitle-19', 'subtitle-20', 'subtitle-21', 'subtitle-22', 'subtitle-23', 'subtitle-24', 'subtitle-25', 'how-to', 'free-autogpt-repo'];
                                    const isSubtitle = subtitleClasses.includes(className);

                                    const isWaitingBlock = className === 'waiting-block';
                                    // console.log(isWaitingBlock);
                                    const isCaptionText = className === 'caption-text';

                                    // if isSubtitle === subtitle-2, then return children with an ad-unit
                                    if (isSubtitle === 'subtitle-2') {
                                        return (
                                            <>
                                                {children}
                                                <div className="my-8">
                                                    {
                                                        placeAdUnit && (
                                                            <>
                                                                <ins className="adsbygoogle"
                                                                style={{ display: 'block', textAlign: 'center' }}
                                                                data-ad-layout="in-article"
                                                                data-ad-format="fluid"
                                                                data-ad-client="ca-pub-5021308603136043"
                                                                data-ad-slot="6952766017"></ins>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            </>
                                        )
                                    }
                                
                                    if (isWaitingBlock) {
                                            return (
                                                <div id='follow-steps'>
                                                    <div className="my-8">
                                                        {
                                                            placeAdUnit && (
                                                                <>
                                                                    <ins className="adsbygoogle"
                                                                    style={{ display: 'block', textAlign: 'center' }}
                                                                    data-ad-layout="in-article"
                                                                    data-ad-format="fluid"
                                                                    data-ad-client="ca-pub-5021308603136043"
                                                                    data-ad-slot="6952766017"></ins>
                                                                </>
                                                            )
                                                        }
                                                    </div>
                                                    {
                                                        !showGetLinkButton && !showToast && showWelcomeMessage && (
                                                            <div className='flex justify-center align-middle -mt-4 mb-4'>
                                                                <Tooltip
                                                                    content="Subscribe our YouTube"
                                                                    placement="top"
                                                                    style='dark'
                                                                >
                                                                    <a href="https://www.youtube.com/channel/UCBuiwdT12ytcmE_NMEPR-Sw?sub_confirmation=1"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        <button
                                                                            onClick={() => {
                                                                                setIsSubscribed(true);
                                                                                setShowGetLinkButton(true);
                                                                            }}
                                                                            className="relative w-40 z-10 flex justify-center text-center text-lg font-semibold text-gray-900 dark:text-white hover:bg-violet-600 dark:hover:bg-violet-600 focus:outline-none dark:active:bg-pink-600 active:bg-pink-600 rounded-lg px-5 py-2.5 dark:focus:ring-primary-900 my-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:z-50 bg-gradient-to-r from-violet-500 to-transparent"
                                                                            >
                                                                            YouTube
                                                                            <div className='absolute w-40'>
                                                                                <div className='relative w-40 z-20 text-xs rounded-sm align-middle -top-5 -left-16 sm:-ml-20 hover:bg-opacity-50 dark:hover:bg-opacity-50 hover:shadow-2xl bg-gradient-to-r from-violet-500 to-transparent'>
                                                                                    ✅ Follow Step One
                                                                                    {/* Chevron UP SVG code:
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 m-2 text-white dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l5-5m0 0l5 5m-5-5v12" />
                                                                                    </svg> */}
                                                                                    <div className='z-20 w-40 h-4 rounded-sm align-middle absolute top-0 hover:bg-purple-500 hover:bg-opacity-50 bg-purple-400 dark:hover:bg-purple-400 bg-opacity-50 animate-ping-slow hover:animate-ping cursor-pointer'></div>
                                                                                </div>
                                                                            </div>
                                                                        </button>
                                                                    </a>
                                                                </Tooltip>
                                                            </div>
                                                        )
                                                    }
                                                    {
                                                        !showWaitingText && !showWaitingBlock && (
                                                            <div className='relative flex justify-center align-middle -mt-4'>
                                                                <Tooltip
                                                                    content="Get Link"
                                                                    placement="top"
                                                                    style='dark'
                                                                >
                                                                    <button
                                                                    onClick={() => {
                                                                        // setShowPopup(true);
                                                                        // if (isValidAdLink) {
                                                                        //     setShowPopup(false);
                                                                        // }
                                                                        if (localStorage.getItem('returningUser') !== 'true') {
                                                                            if (isSubscribed) {
                                                                                setShowGetLinkButton(true);
                                                                                setShowWaitingText(true);
                                                                                startCountdown();
                                                                                toast.loading('Please wait while we are checking...', {
                                                                                    position: "top-center",
                                                                                    duration: 30000,
                                                                                    style: {backgroundColor: '#111827', color: '#F3F4F6'}
                                                                                })
                                                                                setTimeout(() => {
                                                                                    toast.success('Thank you for subscribing our YouTube channel!', {
                                                                                        position: "top-center",
                                                                                        duration: 10000,
                                                                                        style: {backgroundColor: '#111827', color: '#F3F4F6'}
                                                                                    });
                                                                                }, 20000);
                                                                                localStorage.setItem('returningUser', 'true');
                                                                            } else {
                                                                                toast("🤩Woohoo! You are a new user here!", {
                                                                                    position: "top-center",
                                                                                    duration: 6000,
                                                                                    // Styling
                                                                                    style: {backgroundColor: '#111827', color: '#F3F4F6'}
                                                                                });
                                                                                setTimeout(() => {
                                                                                    toast.error("Not yet subscribed?🥺 Please subscribe our YouTube channel first!", {
                                                                                        position: "top-center",
                                                                                        duration: 6000,
                                                                                        // Styling
                                                                                        style: {backgroundColor: '#111827', color: '#F3F4F6'}
                                                                                    });
                                                                                }, 3000);
                                                                            }
                                                                        } else {
                                                                            toast.success('You are already an old user and made your decision about subscribing!', {
                                                                                position: "top-center",
                                                                                duration: 10000,
                                                                                style: {backgroundColor: '#111827', color: '#F3F4F6'}
                                                                            });
                                                                            setShowGetLinkButton(true);
                                                                            setShowWaitingText(true);
                                                                            startCountdown();
                                                                            setTimeout(() => {
                                                                                toast.loading('Please wait...', {
                                                                                    position: "top-center",
                                                                                    duration: 30000,
                                                                                    style: {backgroundColor: '#111827', color: '#F3F4F6'}
                                                                                })
                                                                            }, 2000);
                                                                        }
                                                                    }}
                                                                    className="relative w-40 z-10 flex justify-center text-center text-lg font-semibold text-gray-900 dark:text-white hover:bg-violet-600 dark:hover:bg-violet-600 focus:outline-none dark:active:bg-pink-600 active:bg-pink-600 rounded-lg px-5 py-2.5 dark:focus:ring-primary-900 my-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:z-50 bg-gradient-to-r from-violet-500 to-transparent"
                                                                    >
                                                                        Get the link
                                                                        <div className='w-10 h-10 rounded-full align-middle absolute top-0 hover:bg-purple-500 hover:bg-opacity-50 bg-purple-400 dark:hover:bg-purple-400 bg-opacity-50 animate-ping-slow hover:animate-ping cursor-pointer'></div>
                                                                        <div className='absolute w-40'>
                                                                            <div className='relative w-40 z-20 text-xs rounded-sm align-middle -top-5 -left-16 sm:-ml-20 hover:bg-opacity-50 dark:hover:bg-opacity-50 hover:shadow-2xl bg-gradient-to-r from-violet-500 to-transparent'>
                                                                                ✅ Follow Step Two
                                                                                <div className='z-20 w-40 h-4 rounded-sm align-middle absolute top-0 hover:bg-purple-500 hover:bg-opacity-50 bg-purple-400 dark:hover:bg-purple-400 bg-opacity-50 animate-ping-slow hover:animate-ping cursor-pointer'></div>
                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                </Tooltip>

                                                                {/* {showPopup && (
                                                                    <>
                                                                        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50
                                                                            dark:bg-white dark:bg-opacity-50 dark:text-black dark:dark-mode-text'></div>
                                                                        <div id='ad-popup' className='absolute top-full left-1/2 transform -translate-x-1/2 
                                                                            bg-white p-6 z-50 rounded-lg shadow-md w-full
                                                                            dark:bg-black dark:dark-mode-text dark:border-gray-800 dark:text-white'
                                                                        ref={modalRef}
                                                                        >
                                                                            <AdPopup onClose={handlePopupClose} onAdLinkEntered={handleAdLinkEntered} />
                                                                        </div>
                                                                    </>
                                                                )} */}

                                                            </div>
                                                        )
                                                    }


                                                    {
                                                        showWaitingText && !showWaitingBlock && (
                                                                <p className="waiting-block__p mb-8 text-gray-900 dark:text-white">Please wait <strong>{countdown}s</strong> to get the link</p>
                                                        )
                                                    }
                                                    {
                                                        showWaitingText && showWaitingBlock && (
                                                            <div className="waiting-block">{children}</div>
                                                        )
                                                    }
                                                    <div className="my-8">
                                                        {
                                                            placeAdUnit && (
                                                                <>
                                                                    {/* <!-- Recommended-ad-unit --> */}
                                                                    {/* <ins className="adsbygoogle"
                                                                    style={{ display: 'block' }}
                                                                    data-ad-client="ca-pub-1339539882255727"
                                                                    data-ad-slot="9618957531"
                                                                    data-ad-format="auto"
                                                                    data-full-width-responsive="true"></ins> */}

                                                                    {/* <!-- Recommended-ad-unit --> */}
                                                                    <ins className="adsbygoogle"
                                                                    style={{ display: 'block' }}
                                                                    data-ad-client="ca-pub-5021308603136043"
                                                                    data-ad-slot="3167248456"
                                                                    data-ad-format="auto"
                                                                    data-full-width-responsive="true"></ins>
                                                                </>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            )
                                    } else if (isCaptionText) {
                                        return (
                                            <div className="caption-text text-center text-xs italic font-extralight mb-8 text-gray-900 dark:text-gray-400">{children}</div>
                                        )
                                    } else if (className === 'table-of-contents') {
                                        return (
                                            <div className="table-of-contents relative rounded-md p-4 my-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-400 shadow-inner transition duration-500 ease-in-out">
                                                {/* // Add an absolutely positioned element to the table of contents */}
                                                {/* // that will be used to toggle the table of contents */}
                                                <button onClick={handleToggleElementClick}
                                                className="toggle-element absolute top-5 right-5 cursor-pointer font-bold text-indigo-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full px-1 shadow-xl dark:shadow-xl hover:shadow-inner hover:shadow-indigo-200 dark:hover:shadow-gray-700 shadow-indigo-600 dark:shadow-indigo-600"
                                                >
                                                    <i className="fas fa-chevron-up"></i>
                                                </button>

                                                {children}
                                            </div>
                                        )
                                    } else if (className === 'popup-page') {
                                        return (
                                            <>
                                                <div id='popup-page-link' className="popup-page">
                                                    <blockquote className='mb-8 italic text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow-gray-200 dark:shadow-gray-700 shadow-inner'>
                                                        Log in using these &nbsp;
                                                        <button onClick={() => {
                                                            setShowPopupPage(true)
                                                            const popupPageElement = document.querySelector('.popup-page');
                                                            if (popupPageElement) {
                                                                popupPageElement.scrollIntoView();
                                                            }
                                                        }}
                                                        className="text-indigo-700 hover:text-pink-300 dark:hover:text-pink-300 cursor-pointer dark:text-indigo-500 transition duration-500 hover:underline dark:hover:underline" title="LinkedIn Learning Free trial Accounts">Free trials here ⬇</button>
                                                    </blockquote>
                                                </div>
                                                {
                                                    showPopupPage && (
                                                        <>
                                                            <div className="popup-page sticky p-8 text-sm shadow-2xl z-40 flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-800 dark:bg-opacity-95 w-full sm:mx-auto transition duration-500 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl">
                                                                    <div className="popup-page__content__header text-gray-900 dark:text-white justify-center items-center text-center mt-4">
                                                                        <p>If you appreciate my work, maybe you could show your support by buying me a cup of coffee/tea ☕️🤗</p>

                                                                        <div className="flex justify-center items-center mt-4 mb-4">
                                                                            <Link href="https://www.buymeacoffee.com/ProgrammersLife" target="_blank" rel="noopener noreferrer" title="Buy me a coffee" className="flex justify-center items-center text-gray-900 dark:text-white hover:text-gray-900 dark:hover:text-white transition duration-500 ease-in-out transform hover:scale-110 hover:shadow-2xl hover:z-10 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 active:bg-gray-700">
                                                                                <Image
                                                                                    src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png"
                                                                                    alt="Buy Me A Coffee"
                                                                                    width={160}
                                                                                    height={40}
                                                                                    className="w-40"
                                                                                    loading="lazy"
                                                                                />
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                    <div className="popup-page__content__body text-gray-900 dark:text-white px-8 sm:p-4 sm:max-w-lg max-w-sm">
                                                                        {children}
                                                                    </div>

                                                                    <button
                                                                        className="absolute right-1 top-1 w-8 h-8 rounded-full border-none bg-gray-700 hover:bg-gray-900 cursor-pointer transform hover:scale-110 hover:shadow-2xl hover:z-10 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 active:bg-gray-700 transition duration-300 ease-in-out"
                                                                        onClick={() => {
                                                                            onCloseButtonClick();
                                                                            const popupPageLink = document.getElementById("popup-page-link");
                                                                            if (popupPageLink) {
                                                                                popupPageLink.scrollIntoView();
                                                                            }
                                                                        }}
                                                                    >
                                                                        <Tooltip
                                                                        content="Close"
                                                                        placement="left"
                                                                        style="dark"
                                                                        className="text-xs transition duration-700 ease-in-out"
                                                                        >
                                                                        <svg
                                                                            className="w-6 h-6 text-white text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="currentColor"
                                                                            strokeWidth="2"
                                                                            fill="none"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        >
                                                                            <path d="M18 6L6 18M6 6l12 12" />
                                                                        </svg>
                                                                        </Tooltip>
                                                                    </button>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            </>
                                        )
                                    } else if (className === 'go-to-link') {
                                        return (
                                            <>
                                                {
                                                    !showGoToLinkButton && (
                                                        <>
                                                            <div className="go-to-link">
                                                                <div className="flex justify-center items-center">
                                                                    <Tooltip
                                                                        content="Go to Link 👇"
                                                                        placement="top"
                                                                        style='dark'
                                                                    >
                                                                        <button
                                                                        onClick={() => {
                                                                            setShowGoToLinkButton(true);
                                                                            const goToLinkElement = document.getElementById("follow-steps");
                                                                            if (goToLinkElement) {
                                                                                goToLinkElement.scrollIntoView();
                                                                            }
                                                                        }}
                                                                        className="relative w-full z-10 flex justify-center text-center text-lg font-semibold text-gray-900 dark:text-white hover:bg-violet-600 dark:hover:bg-violet-600 focus:outline-none dark:active:bg-pink-600 active:bg-pink-600 rounded-lg px-5 py-2.5 dark:focus:ring-primary-900 my-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:z-50 bg-gradient-to-r from-violet-500 to-transparent"
                                                                        >
                                                                            Go to Link 👇
                                                                            <div className='w-10 h-10 rounded-full align-middle absolute top-0 hover:bg-purple-500 hover:bg-opacity-50 bg-purple-400 dark:hover:bg-purple-400 bg-opacity-50 animate-ping-slow hover:animate-ping cursor-pointer'></div>
                                                                        </button>
                                                                    </Tooltip>
                                                                    <div className="my-8">
                                                                        {
                                                                            placeAdUnit && (
                                                                                <>
                                                                                    {/* <!-- Recommended-ad-unit --> */}
                                                                                    {/* <ins className="adsbygoogle"
                                                                                    style={{ display: 'block' }}
                                                                                    data-ad-client="ca-pub-1339539882255727"
                                                                                    data-ad-slot="9618957531"
                                                                                    data-ad-format="auto"
                                                                                    data-full-width-responsive="true"></ins> */}

                                                                                    {/* <!-- Recommended-ad-unit --> */}
                                                                                    <ins className="adsbygoogle"
                                                                                    style={{ display: 'block' }}
                                                                                    data-ad-client="ca-pub-5021308603136043"
                                                                                    data-ad-slot="3167248456"
                                                                                    data-ad-format="auto"
                                                                                    data-full-width-responsive="true"></ins>
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            </>
                                        )
                                    } else if (isSubtitle) {
                                        return (
                                            <div className={className} id={className}>{children}</div>
                                        )
                                    }
                                    else {
                                        return (
                                            <div className={className}>{children}</div>
                                        )
                                    }
                                },
                                ol: ({ children }) => <ol className="list-decimal leading-10 bg-gray-200 dark:bg-gray-700 px-10 py-0 my-2 rounded font-mono text-sm text-gray-900 dark:text-gray-100">{children}</ol>,
                                li: ({ children }) => <li className="text-gray-900 dark:text-gray-400">{children}</li>,
                                ul: ({ children }) => <ul className="list-disc px-10 py-0 my-2 text-gray-900 dark:text-gray-100">{children}</ul>,
                                img: ({ src }) => {
                                    const Image = dynamic(() => import('next/image'));
                                    return (
                                        <Image
                                            className="w-full h-full cursor-pointer shadow-lg rounded-lg hover:shadow-2xl mb-4"
                                            src={src}
                                            alt="Post image"
                                            layout="responsive"
                                            width={700}
                                            height={475}
                                            loading="lazy"
                                        />
                                    );
                                },
                                video: ({ src, children }) => {
                                    // console.log(thumbnail);
                                    // console.log(children);

                                    // const videoId = src.split("/").pop();

                                    const DynamicReactPlayer = dynamic(() => import('react-player'), {
                                        ssr: false
                                    });
                                    return (
                                        <div className="cursor-pointer shadow-lg rounded-t-lg lg:rounded-lg object-top transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:z-50 hover:rounded-lg hover:rounded-b-none hover:rounded-r-none hover:rounded-l-none hover:rounded-t-none hover:rounded-tl-none hover:rounded-tr-none hover:rounded-bl-none hover:rounded-br-none">
                                            <div className="hygraph-player">
                                                <DynamicReactPlayer url={src} controls width="100%" height="100%" />
                                            </div>
                                        </div>
                                        // <div className="hygraph-player">
                                        //     {!isVideoPlaying && (
                                        //         <img
                                        //             src={`${thumbnailUrl}`}
                                        //             alt="Video thumbnail"
                                        //             onClick={() => setIsVideoPlaying(true)}
                                        //         />
                                        //         )}
                                        //         {isVideoPlaying && (
                                        //         <div className="react-player-wrapper">
                                        //             <DynamicReactPlayer
                                        //             url={src}
                                        //             playing={true}
                                        //             width="100%"
                                        //             height="100%"
                                        //             onEnded={() => setIsVideoPlaying(false)}
                                        //             />
                                        //         </div>
                                        //         )}
                                        //         <div className="play-button" onClick={() => setIsVideoPlaying(true)}>
                                        //         <FaPlay />
                                        //         </div>
                                        // </div>
                                    );
                                },
                                
                                }}
                            />
                        
                        </section>
                    </motion.div>
                    <motion.div className="my-8" variants={fadeInUp}>
                        {
                            placeAdUnit && (
                                <>
                                    {/* <!-- Recommended-ad-unit --> */}
                                    {/* <ins className="adsbygoogle"
                                    style={{ display: 'block' }}
                                    data-ad-client="ca-pub-1339539882255727"
                                    data-ad-slot="9618957531"
                                    data-ad-format="auto"
                                    data-full-width-responsive="true"></ins> */}

                                    {/* <!-- Recommended-ad-unit --> */}
                                    <ins className="adsbygoogle"
                                    style={{ display: 'block' }}
                                    data-ad-client="ca-pub-5021308603136043"
                                    data-ad-slot="3167248456"
                                    data-ad-format="auto"
                                    data-full-width-responsive="true"></ins>
                                </>
                            )
                        }
                    </motion.div>
                </article>
            </motion.div>
        </>
    )
}

PostDetail.propTypes = {
    post: PropTypes.object.isRequired,
    onCopyToClipboard: PropTypes.func.isRequired,
    isCopied: PropTypes.bool,
    onEnablePopupMessage: PropTypes.func,
    showToast: PropTypes.bool,
    showWelcomeMessage: PropTypes.bool,
    error: PropTypes.string,
    isCaptionText: PropTypes.bool,
    isSubtitle: PropTypes.bool,
    placeAdUnit: PropTypes.bool,
    showWaitingText: PropTypes.bool,
    showWaitingBlock: PropTypes.bool,
    showGetLinkButton: PropTypes.bool,
}

export default PostDetail