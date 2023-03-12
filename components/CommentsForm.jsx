import React, {useEffect, useRef, useState} from 'react'
import { Tooltip, Checkbox, Toast, Flowbite, Alert } from "flowbite-react";

import { submitComment } from '../services'

const CommentsForm = ({ slug }) => {
    const [error, setError] = useState(false)
    const [localStorage, setLocalStorage] = useState(null)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [showUndoSave, setShowUndoSave] = useState(false)
    const commentEl = useRef()
    const nameEl = useRef()
    const emailEl = useRef()
    const storeDataEl = useRef()

    useEffect(() => {
        nameEl.current.value = window.localStorage.getItem('name') || ''
        emailEl.current.value = window.localStorage.getItem('email') || ''
    }, [])
    

    const handleCommentSubmission = () => {
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
        } else {
            window.localStorage.removeItem('name')
            window.localStorage.removeItem('email')
        }
        
        submitComment(commentObj)
            .then((res) => {
                setShowSuccessMessage(true)
                setTimeout(() => {
                    setShowSuccessMessage(false)
                }, 30000)
            })
        
        
        setShowUndoSave(true)
    }
    // console.log(showUndoSave, "++++ showUndoSave on submission.")

  return (
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
            <div>
                <Tooltip
                content="We'd love to know your Name!😍"
                style="dark"
                >
                    <div className='flex'>
                        <label htmlFor="name" className="block text-gray-700 dark:text-gray-400 font-bold mb-2">
                            Name
                        </label>
                        <span className='ml-1 mt-1 text-gray-700 dark:text-gray-400'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4">
                                <path fill="currentColor" d="M12 22c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zm0-2c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zM11 7h2v6h-2zm0 8h2v2h-2z"/>
                            </svg>
                        </span>
                    </div>
                </Tooltip>
            <input
                ref={nameEl}
                type="text"
                id="name"
                name="name"
                placeholder='Enter your name here...'
                className="block w-full bg-gray-200 dark:bg-gray-800 dark:shadow-inner dark:shadow-[-60px_60px_600px_50px_rgba(0,10,9,0.3)] dark:focus:shadow-[-60px_6px_500px_80px_rgba(80,10,100,0.3)] dark:text-gray-200 border border-gray-200 dark:border-none rounded-md py-2 px-4 mb-2 leading-tight outline-none focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-gray-500 dark:focus:border-gray-500 focus:shadow-outline transition ease-in-out duration-700 mb-4 resize-none font-normal"
                required
            />
            </div>
            {/* Email Input */}
            <div>
                <Tooltip
                content={
                    <p className='flex'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-1">
                            <path fill="lightgreen" d="M12 22c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zm0-2c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zM11 7h2v6h-2zm0 8h2v2h-2z"/>
                        </svg>
                        Your email will not be published. We'll only use it to contact you if we have any questions about your comment.
                    </p>
                }
                style="dark"
                >
                    <div className='flex'>
                        <label htmlFor="email" className="block text-gray-700 dark:text-gray-400 font-bold mb-2">
                            Email
                        </label>
                        <span className='ml-1 mt-1 text-gray-700 dark:text-gray-400'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4">
                                <path fill="currentColor" d="M12 22c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zm0-2c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zM11 7h2v6h-2zm0 8h2v2h-2z"/>
                            </svg>
                        </span>
                    </div>
                </Tooltip>
                <input
                    ref={emailEl}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email here..."
                    className="block w-full bg-gray-200 dark:bg-gray-800 dark:shadow-inner dark:shadow-[-60px_60px_600px_50px_rgba(0,10,9,0.3)] dark:focus:shadow-[-60px_6px_500px_80px_rgba(80,10,100,0.3)] dark:text-gray-200 border border-gray-200 dark:border-none rounded-md py-2 px-4 mb-2 leading-tight outline-none focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-gray-500 dark:focus:border-gray-500 focus:shadow-outline transition ease-in-out duration-700 mb-4 resize-none font-normal"
                    required
                />
            </div>
        </div>
        {/* Comment Input */}

        <div className="grid grid-cols-1 gap-4 mb-4 w-full">
            <Tooltip
            content="We'd love to hear your feedback on this post!😍"
            style="dark"
            >
                <div className='flex'>
                    <label htmlFor="comment" className="block text-gray-700 dark:text-gray-400 font-bold mb-2">
                        Comment
                    </label>
                    <span className='ml-1 mt-1 text-gray-700 dark:text-gray-400'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4">
                            <path fill="currentColor" d="M12 22c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zm0-2c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zM11 7h2v6h-2zm0 8h2v2h-2z"/>
                        </svg>
                    </span>
                </div>
            </Tooltip>

            <textarea
            ref={commentEl}
            id="comment"
            name="comment"
            placeholder="Enter your comment here..."
            className="block w-full bg-gray-200 dark:bg-gray-800 dark:shadow-inner dark:shadow-[-60px_60px_600px_50px_rgba(0,10,9,0.3)] dark:focus:shadow-[-60px_6px_500px_80px_rgba(80,10,100,0.3)] transition ease-in-out duration-700 dark:text-gray-200 border border-gray-200 dark:border-none rounded-md py-2 px-4 leading-tight outline-none focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-gray-500 dark:focus:border-gray-500 focus:shadow-outline mb-4 resize-none h-32 font-normal "
            required
            />
        </div>
        <div className="grid grid-cols-1 gap-4 mb-4">
            <div className='flex'>
                <Tooltip
                content="Choose if you want to save your information for future comments."
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
                <Toast>
                        <div className="text-sm font-normal">
                            Conversation archived.
                        </div>
                        <div className="ml-auto flex items-center space-x-2">
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
                            <Toast.Toggle />
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
            content="Send your comment"
            style="dark"
        >
            <button
            onClick={handleCommentSubmission}
            type="submit"
            className="inline-flex self-center text-md font-semibold text-gray-900 hover:text-white dark:text-gray-100 hover:bg-pink-600 dark:hover:bg-pink-600 focus:outline-none dark:active:bg-blue-600 active:bg-blue-600 rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4 transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:z-50 bg-gradient-to-r from-pink-500 to-transparent"
            >
            Post Comment
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

                        <p className="custom-success-message font-semibold dark:text-white text-sm italic">Comment Submitted Successfully!</p>
                    </div>
                    
                    <div className='flex mb-2'>
                        <Alert
                        color="success"
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
  )
}

export default CommentsForm