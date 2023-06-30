import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaComment } from 'react-icons/fa';
import '@fortawesome/fontawesome-free/css/all.css';
import { Helmet } from 'react-helmet-async';
import duotoneDark from 'prism-react-renderer/themes/duotoneDark';
import duotoneLight from 'prism-react-renderer/themes/duotoneLight';

import { Prism } from '@mantine/prism';

import { RichText } from '@graphcms/rich-text-react-renderer';
import moment from 'moment';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Tooltip } from "flowbite-react";




const PostDetail = ({ post, onCopyToClipboard, isCopied, onEnablePopupMessage }) => {
    const [showWaitingBlock, setShowWaitingBlock] = useState(false);
    const [showWaitingText, setShowWaitingText] = useState(false);
    const [countdown, setCountdown] = useState(30);

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

    // Content customizations ...
    useEffect(() => {
        // A helper function takes a class name as an argument and returns the corresponding element using querySelector
        const getElement = (className) => document.querySelector(`div.${className}`);
        // This helper function checks if an element exists and assigns the provided ID to it
        const addIdToElement = (element, id) => {
        if (element) {
        element.id = id;
        }
    };
    
        const subtitleClasses = ['subtitle-1', 'subtitle-2', 'subtitle-3', 'subtitle-4', 'subtitle-5', 'subtitle-6', 'subtitle-7', 'subtitle-8', 'how-to', 'free-autogpt-repo'];
        subtitleClasses.forEach((subtitleClass, index) => { // Loop through the array of subtitle class names
            const subtitle = getElement(subtitleClass); // Select the specific <div> element with class name 'subtitle-*'
            addIdToElement(subtitle, `subtitle-${index + 1}`); // Add the ID 'subtitle-*' to the selected <div> element
        });

    }, []);

    // Content customizations ...
    useEffect(() => {
        const tableOfContents = document.querySelector('.table-of-contents'); // Select the specific <div> element with class name 'table-of-contents'
        if (!tableOfContents) return; // If the table of contents doesn't exist, return

            tableOfContents.classList.add('relative', 'shadow-inner', 'transition', 'duration-500', 'ease-in-out');
            // Add an absolutely positioned element to the table of contents
            const toggleElement = document.createElement('div');
            toggleElement.classList.add('toggle-element', 'absolute', 'top-5', 'right-5', 'cursor-pointer', 'font-bold', 'text-indigo-600', 'bg-gray-200', 'hover:bg-gray-300', 'dark:bg-gray-800', 'dark:hover:bg-gray-700', 'rounded-full', 'px-1');
            toggleElement.innerHTML = '<i class="fas fa-chevron-up"></i>';
            
            const handleToggleClick = () => {
                // Toggle element click event handler logic...
                toggleElement.classList.add('rotate-180', 'font-bold', 'transition', 'duration-500', 'ease-in-out', 'bg-gray-200', 'dark:bg-gray-800', 'dark:hover:bg-gray-700', 'shadow-xl', 'dark:shadow-xl', 'rounded-full', 'px-1', 'hover:shadow-inner', 'hover:bg-gray-300', 'hover:shadow-indigo-200', 'dark:hover:shadow-gray-700', 'shadow-indigo-600', 'dark:shadow-indigo-600');
                const pTags = tableOfContents.querySelectorAll('p');
                const isCollapsed = pTags[0].classList.contains('hidden');
                pTags.forEach((pTag, index) => {
                    if (isCollapsed && index <= 3) {
                        pTag.classList.remove('hidden');
                        toggleElement.classList.remove('rotate-180');
                    } else {
                        pTag.classList.add('hidden');
                    }
                });
            };
            toggleElement.addEventListener('click', handleToggleClick);
            
            tableOfContents.appendChild(toggleElement);

            

        const toggleElements = document.querySelectorAll('.table-of-contents .toggle-element');

        toggleElements.forEach((element) => {
            const className = element.className.trim();
            const classList = className.split(' ');
            
            if (className.includes('toggle-element') && classList.length === 7) {
                element.parentNode.removeChild(element);
            }
        });

    }, []);
    
    // Content customizations ...
    useEffect(() => {
        // Show the first three elements of the table of contents, and show 'view all' after the third element, and show all elements in the table of contents after clicking 'view all'
        const tableOfContentsPTags = document.querySelectorAll('.table-of-contents p');
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
                return () => {
                    // Clean up the event listeners when the component unmounts
                    tableOfContentsPTags.forEach((pTag) => {
                        const pTagChildren = pTag.children[0];
                        pTagChildren.removeEventListener('click', handleViewAllClick);
                    });
                };
            }

            const toggleElements = document.querySelectorAll('.table-of-contents .toggle-element');
            const classNames = new Set(); // Create a new Set object to store the class names of the toggle elements in the table of contents (to avoid duplicate class names)

            toggleElements.forEach((element) => {
                const className = element.className.trim(); // Remove the leading and trailing whitespace characters from the class name string and assign it to a variable called 'className'
                if (classNames.has(className)) { // Check if the Set object already contains the class name
                    element.parentNode.removeChild(element); // Remove the duplicate toggle element from the DOM
                } else {
                    classNames.add(className); // Add the class name to the Set object if it doesn't already exist in the Set object
                }
            });
        });

    }, []);

    const formattedText = post.content.text.replace(/\\n/g, '\n\n');
    // console.log(formattedText);

    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
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
            const articleUrl = encodeURIComponent(`https://programmerslife.site/post/${post.slug}`);
            const articleTitle = encodeURIComponent(post.title);
            const redirectUri = encodeURIComponent(`https://programmerslife.site/m/share/success?postId=${post.slug}`);
            const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?mini=true&url=${articleUrl}&title=${articleTitle}&redirect_uri=${redirectUri}`;

            // window.open(redirectUri, '_blank');
            // window.open(linkedInUrl, '_blank');

            const linkedInWindow = window.open(linkedInUrl, 'linkedin-share-dialog', 'width=626,height=436');
            const successWindow = window.open(`https://programmerslife.site/m/share/success?postId=${post.slug}`, '_blank', 'width=1226,height=736');

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
                    window.open(`https://programmerslife.site/m/share/success?postId=${post.slug}`, '_blank', 'width=1226,height=736');
                }, 20000);
            }

        };

        const handleFacebookClick = () => {
            const articleUrl = encodeURIComponent(`https://programmerslife.site/post/${post.slug}`);
            const facebookAppId = '5864440530335233';
            const facebookUrl = `https://www.facebook.com/dialog/share?app_id=${facebookAppId}&display=popup&href=${articleUrl}&redirect_uri=https%3A%2F%2Fprogrammerslife.site%2Fm%2Fshare%2Fsuccess%3FpostId%3D${post.slug}`;

            // window.open(facebookUrl, '_blank');
            
            const facebookWindow = window.open(facebookUrl, 'facebook-share-dialog', 'width=626,height=436');
            const successWindow = window.open(`https://programmerslife.site/m/share/success?postId=${post.slug}`, '_blank', 'width=1226,height=736');
            
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
            //         window.open(`https://programmerslife.site/m/share/success?postId=${post.slug}`, '_blank', 'width=1226,height=736');
            //     }, 20000);
            // }
        };

        // const handleTwitterClick = () => {
        //     const articleUrl = encodeURIComponent(`https://programmerslife.site/post/${post.slug}`);
        //     const articleTitle = encodeURIComponent(post.title);
        //     // const redirectUri = encodeURIComponent(`https://programmerslife.site/m/share/success?postId=${post.slug}`);
        //     const twitterUrl = `https://twitter.com/intent/tweet?url=${articleUrl}&text=${articleTitle}&via=mindh4q3rr`;

            
        //     const twitterWindow = window.open(twitterUrl, 'twitter-share-dialog', 'width=626,height=436');
        //     const successWindow = window.open(`https://programmerslife.site/m/share/success?postId=${post.slug}`, '_blank', 'width=1226,height=736');

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
        //             window.open(`https://programmerslife.site/m/share/success?postId=${post.slug}`, '_blank', 'width=1226,height=736');
        //         }, 20000);
        //     }

        // };

        const openTwitterShareWindow = (twitterUrl) => {
            const twitterWindow = window.open(twitterUrl, 'twitter-share-dialog', 'width=626,height=436');
            const successWindow = window.open(`https://programmerslife.site/m/share/success?postId=${post.slug}`, '_blank', 'width=1226,height=736');
            
            if (!twitterWindow || !successWindow || twitterWindow.closed || successWindow.closed) {
                onEnablePopupMessage();
                twitterWindow?.close();
            } else {
                successWindow.close();
            }
            
            if (!twitterWindow?.closed) {
                window.setTimeout(() => {
                    window.open(`https://programmerslife.site/m/share/success?postId=${post.slug}`, '_blank', 'width=1226,height=736');
                }, 20000);
            }
        };
            
        const handleTwitterClick = () => {
            const articleUrl = encodeURIComponent(`https://programmerslife.site/post/${post.slug}`);
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
        const words = text.split(' ').length;
        const wordsPerMinute = 60;
        const minutes = Math.round(words / wordsPerMinute);
        return minutes;
    }
    
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

    return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl lg:p-8 pb-12 m-0 mb-8 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl">
                <Helmet>
                    <title>{post.title} | ProgrammersLife™</title>
                    <meta name="description" content={post.excerpt} />
                    
                    <link rel="canonical" href={`https://programmerslife.site/posts/${post.slug}`} />
                </Helmet>
                <div className="relative overflow-hidden shadow-xl mb-6 cursor-pointer transition duration-700 ease-in-out transform hover:opacity-80">
                    <img 
                        src={post.featuredImage.url}
                        alt={post.title}
                        className="object-top w-full h-full rounded-t-lg hover:shadow-inner"
                    />
                </div>
                <div className="px-4 lg:px-0">
                    <div className="lg:flex block items-center justify-center mb-4 w-full">
                        <a href={`/post/${post.slug}#authorBio`}>
                            <div className="flex items-center justify-center mb-4 lg:mb-0 w-full lg:w-auto mr-2">
                                <div className='relative'>
                                    <img
                                        alt={post.author.name}
                                        height="30"
                                        width="30"
                                        src={post.author.photo.url}
                                        className="rounded-full align-middle border-none shadow-lg cursor-pointer"
                                    />
                                    <div className='w-full h-full rounded-full align-middle absolute top-0 hover:bg-purple-500 hover:bg-opacity-50 hover:animate-ping bg-purple-400 dark:hover:bg-purple-400 bg-opacity-50 animate-ping-slow cursor-pointer'></div>
                                </div>
                                <p className="inline align-middle text-gray-700 dark:text-gray-200 ml-2 text-lg cursor-pointer">{post.author.name}</p>
                            </div>
                        </a>
                        <div className="flex items-center justify-center w-full lg:w-auto font-medium text-gray-700 dark:text-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className='mr-2'>
                                {moment(post.createdAt).format('MMMM Do YYYY')}
                            </span>
                                &nbsp;•&nbsp;
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
                            <span className='text-gray-700 dark:text-gray-200'>
                                {getMinutesRead(post.content.text)} min read
                            </span>
                        </div>
                    </div>
                    <div className='sm:flex flex items-center justify-center mb-8'>
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
                    </div>
                    <h1 className='mb-8 mt-4 text-3xl font-semibold'>
                        {post.title}
                    </h1>
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

                    <div>
                        <RichText
                        content={post.content.json.children}
                        renderers={{
                        a: ({ children, openInNewTab, href, rel, ...rest }) => {
                            if (href.match(/^https?:\/\/|^\/\//i)) {
                            return (
                                    <a
                                    className='text-indigo-700 hover:text-pink-300 dark:hover:text-pink-300 cursor-pointer dark:text-indigo-500 transition duration-700'
                                    href={href}
                                    target={openInNewTab ? '_blank' : '_self'}
                                    rel={rel || 'noopener noreferrer'}
                                    {...rest}
                                    >
                                        {children}

                                    </a>
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
                            ({ children }) => 
                        {
                            const [preContent, setPreContent] = useState("");

                            // useEffect(() => {
                            //     const childArray = React.Children.toArray(children);
                            //     console.log(childArray[0]);
                            //     let content = "";
                            //     for (let i = 0; i < childArray.length; i++) {
                            //         const child = childArray[i].props.content[0].text;
                            //         // console.log(child);
                            //         if (typeof child === "string") {
                            //         content += child;
                            //         } else if (child.props && child.props.children) {
                            //         const grandchildArray = React.Children.toArray(child.props.children);
                            //         for (let j = 0; j < grandchildArray.length; j++) {
                            //             const grandchild = grandchildArray[j];
                            //             if (typeof grandchild === "string") {
                            //             content += grandchild;
                            //             }
                            //         }
                            //         }
                            //     }
                            //     setPreContent(content);
                            //     }, [children]);

                            useEffect(() => {
                                const childArray = React.Children.toArray(children);
                                    // console.log(childArray[0]);
                                    
                                let content = "";
                                for (let i = 0; i < childArray.length; i++) {
                                  const child = childArray[i];
                                //   console.log(child.props.content[0].children[0].text);
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
                              }, [children]);

                            return (
                                <div>
                                    {/* <pre id="code-block" ref={preRef}>
                                        {children}
                                    </pre> */}
                                    <Prism
                                        language="javascript"
                                        getPrismTheme={(_theme, colorScheme) =>
                                        colorScheme === "dark" ? duotoneLight : duotoneDark
                                        }
                                        className="m-2"
                                    >
                                        {preContent}
                                    </Prism>
                                </div>
                            );
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
                            const isWaitingBlock = className === 'waiting-block';
                            // console.log(isWaitingBlock);
                            const isCaptionText = className === 'caption-text';
                        
                            if (isWaitingBlock) {
                                    return (
                                        <>
                                            {
                                                !showWaitingText && !showWaitingBlock && (
                                                    <div className='flex justify-center align-middle -mt-4'>
                                                            <button
                                                            onClick={() => {
                                                                setShowWaitingText(true);
                                                                startCountdown();
                                                            }}
                                                            className="relative w-2/5 z-10 flex justify-center text-center text-lg font-semibold text-gray-900 hover:text-white dark:text-gray-100 hover:bg-violet-600 dark:hover:bg-violet-600 focus:outline-none dark:active:bg-pink-600 active:bg-pink-600 rounded-lg px-5 py-2.5 dark:focus:ring-primary-900 my-4 transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:z-50 bg-gradient-to-r from-violet-500 to-transparent"
                                                            >
                                                                Get the link
                                                                <div className='w-10 h-10 rounded-full align-middle absolute top-0 hover:bg-purple-500 hover:bg-opacity-50 bg-purple-400 dark:hover:bg-purple-400 bg-opacity-50 animate-ping-slow hover:animate-ping cursor-pointer'></div>
                                                            </button>
                                                    </div>
                                                )
                                            }

                                            {
                                                showWaitingText && !showWaitingBlock && (
                                                    <p className="waiting-block__p mb-8 text-gray-900 dark:text-gray-400">Please wait <strong>{countdown}s</strong> to get the link</p>
                                                )
                                            }
                                            {
                                                showWaitingText && showWaitingBlock && (
                                                    <div className="waiting-block">{children}</div>
                                                )
                                            }
                                        </>
                                    )
                            } else if (isCaptionText) {
                                return (
                                    <div className="caption-text text-center text-xs italic font-extralight mb-8 text-gray-900 dark:text-gray-400">{children}</div>
                                )
                            } else if (className === 'table-of-contents') {
                                return (
                                    <div className="table-of-contents rounded-md p-4 my-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-400">{children}</div>
                                )
                            } else {
                                return (
                                    <div className={className}>{children}</div>
                                )
                            }
                        },
                        ol: ({ children }) => <ol className="list-decimal leading-10 bg-gray-200 dark:bg-gray-700 px-10 py-0 my-2 rounded font-mono text-sm text-gray-900 dark:text-gray-100">{children}</ol>,
                        li: ({ children }) => <li className="text-gray-900 dark:text-gray-400">{children}</li>,
                        ul: ({ children }) => <ul className="list-disc px-10 py-0 my-2 text-gray-900 dark:text-gray-100">{children}</ul>,
                        img: ({ src }) => <img className="w-full h-full cursor-pointer shadow-lg rounded-lg hover:shadow-2xl mb-4" src={src} />,
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
                    
                    </div>
                </div>
            </div>
    )
}

export default PostDetail