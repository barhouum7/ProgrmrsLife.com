import React, {useEffect, useRef, useState} from 'react'
import { Tooltip, Checkbox, Toast, Flowbite, Alert } from "flowbite-react";
import {HiMail, HiPencilAlt, HiUser} from "react-icons/hi";
import { ToastContainer, toast } from 'react-toastify';

import { submitComment } from '../services'

const CommentsForm = ({ slug, postTitle }) => {
    const [error, setError] = useState(false)
    const [localStorage, setLocalStorage] = useState(null)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [showUndoSave, setShowUndoSave] = useState(false)
    const [isSendingComment, setIsSendingComment] = useState(false)
    const commentEl = useRef()
    const nameEl = useRef()
    const emailEl = useRef()
    const storeDataEl = useRef()

    useEffect(() => {
        nameEl.current.value = window.localStorage.getItem('name') || ''
        emailEl.current.value = window.localStorage.getItem('email') || ''
    }, [])
    

    const handleCommentSubmission = async (e) => {
        setError(false);
        const { value: comment } = commentEl.current;
        const { value: name } = nameEl.current;
        const { value: email } = emailEl.current;
        const { checked: storeData } = storeDataEl.current;

        if (!comment || !name || !email) {
            setError(true);
            return;
        }
        
        const commentObj = { name, email, comment, slug }

        if (storeData) {
            window.localStorage.setItem('name', name)
            window.localStorage.setItem('email', email)
            setShowUndoSave(true)
        } else {
            window.localStorage.removeItem('name')
            window.localStorage.removeItem('email')
            setShowUndoSave(false)
        }
        
        submitComment(commentObj)
            .then((res) => {
                // Show loading toast while sending comment
                toast('✈ Sending your comment...', {
                    position: "top-center",
                    autoClose: 3000,
                    pauseOnHover: true,
                    draggable: true,
                    // show progress bar
                    hideProgressBar: false,
                    className: 'dark:text-white dark:bg-gray-900',
                })
                setIsSendingComment(true)
                setTimeout(() => {
                    setIsSendingComment(false)
                    setShowSuccessMessage(true)
                    const successAlert = document.getElementById("success-alert")
                    successAlert?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }, 3000)

                setTimeout(() => {
                    setShowSuccessMessage(false)
                }, 30000)
            })

            const emailObj = { name, email, postTitle, slug }
            e.preventDefault();
    
            try {
              const response = await fetch("/api/sendCommentConfirmationEmail", {
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
                } else {
                    throw new Error(data.message || 'Something went wrong!');
                }
                // console.log(data);
            } catch (error) {
                console.error(error);
            }
    }

return (
    <>
        {
            isSendingComment &&
            <ToastContainer />
        }
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 sm:p-8 pb-12 m-0 mb-8 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl'>
            {/* Comment Form */}
            <h3 className='text-xl font-semibold border-b pb-4 mb-8'>
                Leave a Comment
            </h3>
            <h4 className='text-sm dark:text-gray-400 pb-4 mb-8'>
                ✨ We're excited to hear from you! Please leave a comment below and let us know what you think.
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Name Input */}
                <div className='relative'>
                    <Tooltip
                    content={
                        <div>
                            We'd love to know your Name!😍 <br />
                            <p className='flex'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-1">
                                    <path fill="lightgreen" d="M12 22c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zm0-2c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zM11 7h2v6h-2zm0 8h2v2h-2z"/>
                                </svg>                        
                                We'll never share your details.
                            </p>
                        </div>
                    }
                    style="dark"
                    >
                        <div className='flex'>
                            <label htmlFor="name" className="block text-gray-700 dark:text-gray-400 font-bold mb-2">
                                Name
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
                    className="pl-8 block w-full bg-gray-200 dark:bg-gray-800 dark:shadow-inner dark:shadow-[-60px_60px_600px_50px_rgba(0,10,9,0.3)] dark:focus:shadow-[-60px_6px_500px_80px_rgba(80,10,100,0.3)] dark:text-gray-200 border border-gray-200 dark:border-none rounded-md py-2 px-4 mb-2 leading-tight outline-none focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-gray-500 dark:focus:border-gray-500 focus:shadow-outline transition ease-in-out duration-700 resize-none font-normal"
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
                                <br />We'll only use it to contact you, if we have any questions about your comment.
                                Read our&nbsp;<a href="/privacyPolicy" target="_top" rel="noopener noreferrer" className='text-indigo-700 hover:text-pink-300 dark:hover:text-pink-300 cursor-pointer dark:text-indigo-500 transition duration-700'>Privacy Policy</a>.
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
                        className="pl-8 block w-full bg-gray-200 dark:bg-gray-800 dark:shadow-inner dark:shadow-[-60px_60px_600px_50px_rgba(0,10,9,0.3)] dark:focus:shadow-[-60px_6px_500px_80px_rgba(80,10,100,0.3)] dark:text-gray-200 border border-gray-200 dark:border-none rounded-md py-2 px-4 mb-2 leading-tight outline-none focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-gray-500 dark:focus:border-gray-500 focus:shadow-outline transition ease-in-out duration-700 resize-none font-normal"
                        required
                    />
                </div>
            </div>
            {/* Comment Input */}

            <div className="grid grid-cols-1 gap-4 mb-4 w-full">
                <div className='relative'>
                    <Tooltip
                    content="We'd love to hear your feedback on this post!😍"
                    style="dark"
                    >
                        <div className='flex'>
                            <label htmlFor="comment" className="block text-gray-700 dark:text-gray-400 font-bold mb-2">
                                Comment
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
                    ref={commentEl}
                    id="comment"
                    name="comment"
                    placeholder="Enter your comment here..."
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
                                Choose if you want to save your information for future comments. <br />
                            </p>
                            
                                We'll never share your details.
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
                        Save my name, email, and website in this browser for the next time I comment.
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
                                            you'll have to enter them next time you comment.
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
                                        If you want to keep your information saved for the next time you comment.
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
            { error && 
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
                content={`
                    ${isSendingComment ? 'Please wait while we send your comment...' : isSendingComment || showSuccessMessage ? 'Comment Sent Successfully!' : 'Send your comment to the author of this post.'}
                `}
                style="dark"
            >
                <button
                disabled={isSendingComment || showSuccessMessage}
                onClick={handleCommentSubmission}
                type="submit"
                // className="cursor-not-allowed inline-flex self-center text-md font-semibold text-white dark:text-gray-100 bg-pink-600 dark:bg-pink-600 rounded-lg text-sm px-5 py-2.5 text-center my-4 hover:bg-opacity-80"
                className={`
                    ${isSendingComment || showSuccessMessage ? 'cursor-not-allowed inline-flex self-center text-md font-semibold text-white dark:text-gray-100 bg-pink-600 dark:bg-pink-600 rounded-lg text-sm px-5 py-2.5 text-center my-4 hover:bg-opacity-80' : 'inline-flex self-center text-md font-semibold text-gray-900 hover:text-white dark:text-gray-100 hover:bg-pink-600 dark:hover:bg-pink-600 focus:outline-none dark:active:bg-blue-600 active:bg-blue-600 rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4 transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:z-50 bg-gradient-to-r from-pink-500 to-transparent'}
                `}
                >
                {
                    isSendingComment ? (
                        // Render a Loader icon + sending...
                        <p className='flex'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="animate-[spin_1s_ease-in-out_infinite] w-5 h-5 mr-2 text-white bg-gradient-to-r from-pink-400 hover:from-pink-500 to-transparent shadow-inner rounded-full border-gray-200 border-t-2 border-solid">
                                <circle fill="transparent" cx="12" cy="12" r="11"/>
                                {/* <path fill="#FFF" d="M17.83 7.8L10.587 15.043l-3.23-3.23a.984.984 0 0 0-1.392 0 .984.984 0 0 0 0 1.392l3.59 3.59a.984.984 0 0 0 1.392 0l7.667-7.667a.984.984 0 0 0 0-1.392.984.984 0 0 0-1.392 0z"/> */}
                            </svg>
                            Sending...
                        </p>
                    ) : 'Send Comment'
                }
                </button>
            </Tooltip>
            </div>
            
            <div id='success-alert' className='transition duration-700 ease-in-out'>
                { showSuccessMessage && 
                    <div className='flex flex-col my-8'>
                        <div className='flex mb-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 mr-2 text-green-500">
                                <circle fill="currentColor" cx="12" cy="12" r="11"/>
                                <path fill="#FFF" d="M17.83 7.8L10.587 15.043l-3.23-3.23a.984.984 0 0 0-1.392 0 .984.984 0 0 0 0 1.392l3.59 3.59a.984.984 0 0 0 1.392 0l7.667-7.667a.984.984 0 0 0 0-1.392.984.984 0 0 0-1.392 0z"/>
                            </svg>

                            <p className="custom-success-message font-semibold dark:text-white text-sm italic">Comment Submitted Successfully!</p>
                        </div>
                        
                        <div className='flex mb-2'>
                            <Alert
                            color="success"
                            rounded={true}
                            withBorderAccent={true}
                            onDismiss={function onDismiss(){setShowSuccessMessage(false); return alert("Alert dismissed!")}}
                            >
                            <span>
                                <span className="font-medium">
                                Success alert!
                                </span>
                                {' '}Thank you for your comment! We'll review it and publish it as soon as possible.
                            </span>
                            </Alert>
                        </div>
                    </div>
                    
                }
            </div>
        </div>
    </>
    )
}

export default CommentsForm