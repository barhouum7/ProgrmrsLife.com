import React, {useEffect, useRef, useState} from 'react'
import { Tooltip, Checkbox, Toast, Alert } from "flowbite-react";
import {HiMail, HiPencil, HiPencilAlt, HiUser} from "react-icons/hi";
import { getPosts } from '../services/index'
import Link from 'next/link'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { AdUnit, Loader } from '../components'
import PropTypes from 'prop-types';

const ContactUs = ({ posts }) => {
    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If the document is still loading, set isLoading to true
    if (document.readyState === "loading") {
      setIsLoading(true);
    }

    // If the document has finished loading, set isLoading to false
    if (document.readyState === "complete") {
      setIsLoading(false);
    }
    
    // If posts are not available, set isLoading to true
    if (!posts) {
      setIsLoading(true);
    }

    // If posts are available, set isLoading to false
    if (posts) {
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }

  }, [posts]);

    const [loading, setLoading] = useState(false)

    const [submitError, setSubmitError] = useState(false)
    // const [localStorage, setLocalStorage] = useState(null)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [showErrorMessage, setShowErrorMessage] = useState(false)
    const [showUndoSave, setShowUndoSave] = useState(false)
    const [placeAdUnit, setPlaceAdUnit] = useState(false)
    const messageEl = useRef()
    const subjectEl = useRef()
    const nameEl = useRef()
    const emailEl = useRef()
    const storeDataEl = useRef()

    useEffect(() => {
        nameEl.current.value = window.localStorage.getItem('name') || ''
        emailEl.current.value = window.localStorage.getItem('email') || ''
        setPlaceAdUnit(true)
    }, [])
    

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setSubmitError(false);
        const { value: message } = messageEl.current;
        const { value: subject } = subjectEl.current;
        const { value: name } = nameEl.current;
        const { value: email } = emailEl.current;
        const { checked: storeData } = storeDataEl.current;
    
        if (!message || !subject || !name || !email) {
            setSubmitError(true);
            return;
        }
        
        if (storeData) {
            window.localStorage.setItem('name', name)
            window.localStorage.setItem('email', email)
            setShowUndoSave(true)
        } else {
            window.localStorage.removeItem('name')
            window.localStorage.removeItem('email')
            setShowUndoSave(false)
        }

        // if (window.localStorage.getItem('name') && window.localStorage.getItem('email')) {
        //     setLocalStorage(true)
        // } else {
        //     setLocalStorage(false)
        // }

        // if ( localStorage && !storeData) {
        //     setShowUndoSave(true)
        // } else {
        //     setShowUndoSave(false)
        // }
        
        const emailObj = { name, email, subject, message }

        try {
            setLoading(true)
            const response = await fetch("/api/send-email", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(emailObj),
            });
    
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong!');
            } else if (response.ok) {
                console.log(data.message)
                setShowSuccessMessage(true)
                setTimeout(() => {
                    setShowSuccessMessage(false)
                }, 10000)
            } else {
                throw new Error(data.message || 'Something went wrong!');
            }
            // console.log(data);
        } catch (error) {
            console.error(error);
            setShowErrorMessage(true)
            setTimeout(() => {
                setShowErrorMessage(false)
            }, 10000)
        } finally {
            setLoading(false)
        }
        
    }
    
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

  return (
    <motion.div 
        className='bg-white dark:bg-gray-800 rounded-t-lg shadow-xl p-8 sm:p-8 pb-12 m-0 mb-0 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl'
        initial="initial"
        animate="animate"
        variants={fadeInUp}
    >
        <Head>
            <title>Contact Us - Programmers Life</title>
            <meta name="description" content="Get in touch with Programmers Life. We'd love to hear from you!" />
        </Head>
        {/* Comment Form */}
        {isLoading ? (
            <Loader 
                loading={isLoading}
            />
        ) : (
            <>
                <div className="max-w-6xl mx-auto py-12 sm:px-6 lg:px-8">
                    <motion.div className="text-center" variants={fadeInUp}>
                        <h1 className="lg:text-4xl text-2xl text-pink-500 dark:text-indigo-400 leading-8 font-extrabold tracking-wide uppercase mb-8">Contact Us</h1>
                        <h3 className='lg:text-xl md:text-lg font-semibold border-b pb-4 mb-8'>
                            Say hello, and Let&apos;s brainstorm together! 📝
                        </h3>
                    </motion.div>
                    <h4 className='text-sm dark:text-gray-400 pt-8 mb-4'>
                        ✨ We&apos;re excited to hear from you! Let&apos;s communicate and let us know your thoughts.
                    </h4>
                    {placeAdUnit && (
                        <>
                            {/* <!-- Recommended-ad-unit --> */}
                            <ins className="adsbygoogle"
                                style={{ display: 'block' }}
                                data-ad-client="ca-pub-5021308603136043"
                                data-ad-slot="3167248456"
                                data-ad-format="auto"
                                data-full-width-responsive="true">
                            </ins>
                        </>
                    )}
                    <motion.div className="mt-10 sm:flex sm:justify-center" variants={fadeInUp}>
                        <form onSubmit={handleSubmit} className="sm:max-w-4xl sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden bg-white dark:bg-gray-800 shadow-xl p-8 sm:p-8 pb-12 m-0 mb-0 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {/* Name Input */}
                                <div className='relative'>
                                    <Tooltip
                                    content={
                                        <div>
                                            We&apos;d love to know your Name!😍 <br />
                                            <p className='flex'>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-1">
                                                    <path fill="lightgreen" d="M12 22c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zm0-2c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zM11 7h2v6h-2zm0 8h2v2h-2z"/>
                                                </svg>                        
                                                We&apos;ll never share your details.
                                            </p>
                                        </div>
                                    }
                                    placement="right"
                                    style="dark"
                                    >
                                        <div className='flex'>
                                            <label htmlFor="name" className="block text-gray-700 dark:text-gray-400 font-bold mb-2">
                                                Full Name
                                            </label>
                                            <span className='ml-1 mt-1 text-gray-700 dark:text-gray-400'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </Tooltip>
                                    <HiUser className="w-5 h-5 absolute top-10 left-1 lg:left-1 sm:left-1 text-gray-500 dark:text-gray-400" />
                                <input
                                    ref={nameEl}
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder='Enter your name here...'
                                    className="pl-8 block w-full bg-gray-200 dark:bg-gray-800 dark:shadow-inner dark:text-gray-200 border border-gray-200 dark:border-none rounded-md py-2 px-4 mb-2 leading-tight outline-none focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-gray-500 dark:focus:border-gray-500 focus:shadow-outline transition ease-in-out duration-700 resize-none font-normal"
                                    required
                                />
                                </div>
                                {/* Email Input */}
                                <div className='relative'>
                                    <Tooltip
                                    content={
                                        <div>
                                            <p className='flex'>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-1">
                                                    <path fill="lightgreen" d="M12 22c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zm0-2c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zM11 7h2v6h-2zm0 8h2v2h-2z"/>
                                                </svg>
                                                Your email will not be published. 
                                            </p>
                                                <br />We&apos;ll only use it to contact you, if we have any questions about your comment.
                                                Read our&nbsp;<Link href='/privacyPolicy' className='text-indigo-700 hover:text-pink-300 dark:hover:text-pink-300 cursor-pointer dark:text-indigo-500 transition duration-700'>Privacy Policy</Link>.
                                        </div>
                                    }
                                    style="dark"
                                    >
                                        <div className='flex'>
                                            <label htmlFor="email" className="block text-gray-700 dark:text-gray-400 font-bold mb-2">
                                                Email
                                            </label>
                                            <span className='ml-1 mt-1 text-gray-700 dark:text-gray-400'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </Tooltip>
                                    <HiMail className="w-5 h-5 absolute top-10 left-1 lg:left-1 sm:left-1 text-gray-500 dark:text-gray-400" />
                                    <input
                                        ref={emailEl}
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email here..."
                                        className="pl-8 block w-full bg-gray-200 dark:bg-gray-800 dark:shadow-inner dark:text-gray-200 border border-gray-200 dark:border-none rounded-md py-2 px-4 mb-2 leading-tight outline-none focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-gray-500 dark:focus:border-gray-500 focus:shadow-outline transition ease-in-out duration-700 resize-none font-normal"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 mb-4 w-full">
                                {/* Subject Input */}
                                <div className='relative'>
                                    <Tooltip
                                    content={
                                        <p className='flex'>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-1">
                                                <path fill="lightgreen" d="M12 22c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zm0-2c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zM11 7h2v6h-2zm0 8h2v2h-2z"/>
                                            </svg>
                                            Let us know what you want to talk about.
                                        </p>
                                    }
                                    style="dark"
                                    >
                                        <div className='flex'>
                                            <label htmlFor="subject" className="block text-gray-700 dark:text-gray-400 font-bold mb-2">
                                                Subject
                                            </label>
                                            <span className='ml-1 mt-1 text-gray-700 dark:text-gray-400'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </Tooltip>
                                    <HiPencil className="w-5 h-5 absolute top-10 left-1 lg:left-1 sm:left-1 text-gray-500 dark:text-gray-400" />
                                    <input
                                        ref={subjectEl}
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        placeholder="Enter your subject here..."
                                        className="pl-8 block w-full bg-gray-200 dark:bg-gray-800 dark:shadow-inner dark:text-gray-200 border border-gray-200 dark:border-none rounded-md py-2 px-4 mb-2 leading-tight outline-none focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-gray-500 dark:focus:border-gray-500 focus:shadow-outline transition ease-in-out duration-700 resize-none font-normal"
                                        required
                                    />
                                </div>
                                {/* Message Input */}
                                <div className='relative'>
                                    <Tooltip
                                    content="We&apos;d love to hear from you!😍"
                                    style="dark"
                                    >
                                        <div className='flex'>
                                            <label htmlFor="message" className="block text-gray-700 dark:text-gray-400 font-bold mb-2">
                                                {/* This is the Email body */}
                                                Message
                                            </label>
                                            <span className='ml-1 mt-1 text-gray-700 dark:text-gray-400'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </Tooltip>
                                    <HiPencilAlt className="w-5 h-5 absolute top-10 left-1 lg:left-1 sm:left-1 text-gray-500 dark:text-gray-400" />
                                    <textarea
                                    ref={messageEl}
                                    id="message"
                                    name="message"
                                    placeholder="Enter your message here..."
                                    className="pl-8 block w-full bg-gray-200 dark:bg-gray-800 dark:shadow-inner dark:shadow-[-60px_60px_600px_50px_rgba(0,10,9,0.3)] dark:focus:shadow-[-60px_6px_500px_80px_rgba(80,10,100,0.3)] transition ease-in-out duration-700 dark:text-gray-200 border border-gray-200 dark:border-none rounded-md py-2 px-4 leading-tight outline-none focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-gray-500 dark:focus:border-gray-500 focus:shadow-outline mb-4 resize-none h-32 font-normal"
                                    required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 mb-4">
                                <div className='flex'>
                                    <Tooltip
                                    content={
                                        <div>
                                            <p className='flex'>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-1">
                                                    <path fill="lightgreen" d="M12 22c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zm0-2c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zM11 7h2v6h-2zm0 8h2v2h-2z"/>
                                                </svg>                        
                                                Choose if you want to save your information for future contact. <br />
                                            </p>
                                            
                                                We&apos;ll never share your details.
                                        </div>
                                    }
                                    style="dark"
                                    >
                                        <Checkbox 
                                        ref={storeDataEl}
                                        id="storeData"
                                        name="storeData"
                                        value={true}
                                        className='cursor-pointer'
                                        />
                                    </Tooltip>
                                    <label className='ml-2 text-md text-gray-700 dark:text-gray-400 cursor-pointer' htmlFor="remember">
                                        Save my name, email, and website in this browser for the next time I contact you.
                                    </label>
                                </div>
                                {showUndoSave &&
                                    <Toast className='bg-gray-200 shadow-xl hover:shadow-indigo-500/40 mb-4 transition duration-700 ease-in-out hover:shadow-2xl'>
                                            <div className="text-sm font-normal">
                                                Conversation archived.
                                            </div>
                                            <div className="ml-auto flex items-center space-x-2">
                                                <Tooltip
                                                content={
                                                    <div>
                                                        <p className='flex'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-1">
                                                                <path fill="lightgreen" d="M12 22c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zm0-2c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zM11 7h2v6h-2zm0 8h2v2h-2z"/>
                                                            </svg>                        
                                                            This removes your name and email from your browser, <br />
                                                        </p>
                                                            you&apos;ll have to enter them next time you contact us.
                                                    </div>
                                                }
                                                style="dark"
                                                >
                                                    <button
                                                    type="submit"
                                                    onClick={() => 
                                                        {
                                                            setShowUndoSave(false);
                                                            window.localStorage.removeItem('name');
                                                            window.localStorage.removeItem('email');
                                                        }}
                                                    className="rounded-lg p-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-700"
                                                    href="#"
                                                    >
                                                    Undo
                                                    </button>
                                                </Tooltip>
                                                <Tooltip
                                                content={
                                                    <div>
                                                        <p className='flex'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-1">
                                                                <path fill="lightgreen" d="M12 22c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zm0-2c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zM11 7h2v6h-2zm0 8h2v2h-2z"/>
                                                            </svg>                        
                                                            Click here to close this notification or simply dismiss it <br />
                                                        </p>
                                                        If you want to keep your information saved for the next time you contact us.
                                                    </div>
                                                }
                                                style="dark"
                                                >
                                                    <Toast.Toggle className='my-2' />
                                                </Tooltip>
                                            </div>
                                    </Toast>
                                }
                            </div>
                            { submitError && 
                                <div className='flex'>
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 mr-2 text-red-500">
                                        <path fill="currentColor" d="M12 2c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10-4.486-10-10-10zM12.5 16.5h-1c-.276 0-.5-.224-.5-.5v-4c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v4c0 .276-.224.5-.5.5zM12.5 11h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v1c0 .276-.224.5-.5.5z"/>
                                    </svg> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-1 text-white bg-red-500 rounded-full">
                                        <circle cx="12" cy="12" r="10" className='text-red-500'/>
                                        <line x1="15" y1="9" x2="9" y2="15" />
                                        <line x1="9" y1="9" x2="15" y2="15" />
                                    </svg>
                                    <p className="custom-error-message font-semibold dark:text-white text-sm italic">All fields are required!</p>
                                </div>
                            }

                            {/* Submit Button */}
                            <div className="mt-8">
                                <Tooltip
                                    content={
                                        loading ? (
                                            <div>
                                                <p className='flex animate-pulse'>
                                                    <svg className="animate-[spin_1s_linear_infinite] -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                                    </svg>
                                                    <span className='text-white'>Sending your e-mail...</span>
                                                </p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className='flex'>
                                                    <span className='text-white'>Send your e-mail</span>
                                                </p>
                                            </div>
                                        )
                                    }
                                    style="dark"
                                >
                                    <button
                                    onClick={handleSubmit}
                                    type="submit"
                                    className="inline-flex self-center text-md font-semibold text-gray-900 hover:text-white dark:text-gray-100 hover:bg-pink-600 dark:hover:bg-pink-600 focus:outline-none dark:active:bg-blue-600 active:bg-blue-600 rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4 transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:z-50 bg-gradient-to-r from-pink-500 to-transparent"
                                    >
                                    {loading ? (
                                        <div className="group flex items-center justify-center">
                                            <svg className="animate-[spin_1s_linear_infinite] -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                            </svg>
                                            <span className='text-white group-hover:animate-pulse'>Sending Email...</span>
                                        </div>
                                    ) : (
                                        <div className="group flex items-center justify-center text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                            </svg>
                                            Send Email
                                        </div>
                                    )}
                                    </button>
                                </Tooltip>
                            </div>
                    
                            <div className='transition duration-700 ease-in-out'>
                                { showSuccessMessage && 
                                    <div className='flex flex-col my-8'>
                                        <div className='flex mb-2'>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 mr-2 text-green-500">
                                                <circle fill="currentColor" cx="12" cy="12" r="11"/>
                                                <path fill="#FFF" d="M17.83 7.8L10.587 15.043l-3.23-3.23a.984.984 0 0 0-1.392 0 .984.984 0 0 0 0 1.392l3.59 3.59a.984.984 0 0 0 1.392 0l7.667-7.667a.984.984 0 0 0 0-1.392.984.984 0 0 0-1.392 0z"/>
                                            </svg>

                                            <p className="custom-success-message font-semibold dark:text-white text-sm italic">Email Submitted Successfully!</p>
                                        </div>
                                        
                                        <div className='flex mb-2'>
                                            <Alert
                                            color="success"
                                            rounded={true}
                                            withBorderAccent={true}
                                            // onDismiss={function onDismiss(){setShowSuccessMessage(false); return alert("Alert dismissed!")}}
                                            >
                                            <span>
                                                <span className="font-medium">
                                                Success alert!
                                                </span>
                                                {' '}Thank you for your email! We&apos;ll get back to you as soon as possible.
                                            </span>
                                            </Alert>
                                        </div>
                                    </div>
                                    
                                }
                            </div>
                            <div className='transition duration-700 ease-in-out'>
                                { showErrorMessage && 
                                    <div className='flex flex-col my-8'>
                                        <div className='flex mb-2'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-1 text-white bg-red-500 rounded-full">
                                            <circle cx="12" cy="12" r="10" className='text-red-500'/>
                                            <line x1="15" y1="9" x2="9" y2="15" />
                                            <line x1="9" y1="9" x2="15" y2="15" />
                                        </svg>

                                            <p className="custom-error-message font-semibold dark:text-white text-sm italic">Email NOT Submitted, Something went wrong!</p>
                                        </div>
                                        
                                        <div className='flex mb-2'>
                                            <Alert
                                            color="warning"
                                            rounded={true}
                                            withBorderAccent={true}
                                            // onDismiss={function onDismiss(){setShowErrorMessage(false); return alert("Alert dismissed!")}}
                                            >
                                            <span>
                                                <span className="font-medium">
                                                Error alert!
                                                </span>
                                                {' '}Something went wrong, please try again.
                                            </span>
                                            </Alert>
                                        </div>
                                    </div>
                                    
                                }
                            </div>
                        </form>
                    </motion.div>
                    {placeAdUnit && (
                        <>
                            {/* <!-- Recommended-ad-unit --> */}
                            <ins className="adsbygoogle"
                                style={{ display: 'block' }}
                                data-ad-client="ca-pub-5021308603136043"
                                data-ad-slot="3167248456"
                                data-ad-format="auto"
                                data-full-width-responsive="true">
                            </ins>
                        </>
                    )}
                </div>
            </>
        )}
    </motion.div>
  )
}

ContactUs.propTypes = {
    posts: PropTypes.array
};

export default ContactUs

// Fetch data at build time
export async function getStaticProps() {
    try {
        const posts = await getPosts();
        return {
        props: { posts },
    // Next.js will attempt to re-generate the page:
        // - When a request is made to the page
        // - At most once every 2 days (172800 seconds)
        revalidate: 172800, // 2 days
        // This is useful for pages that are not frequently updated
        // So if the page is not updated in 2 days, it will be re-generated
        // So what this does is it fetches the posts from the API and stores them in the props
        // For a blog, this is useful because the blog posts are not updated frequently
        // So if the blog posts are not updated in 2 days, the blog posts will be fetched again from the API and stored in the cache
        // And then Next.js will serve the page from the cache if the same page is requested again within 2 days
        };
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}