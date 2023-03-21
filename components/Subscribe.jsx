import React, {useEffect, useRef, useState} from 'react'
import { Alert } from "flowbite-react";
import {HiMail} from "react-icons/hi";
import { submitEmail } from '../services'


const Subscribe = () => {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Your newsletter subscription logic here

        const emailObj = {
            email: email
        }

        submitEmail(emailObj)
            .then((res) => {
                setShowSuccessMessage(true)
                setTimeout(() => {
                    setShowSuccessMessage(false)
                }, 30000)
            })
    };

return (
    <section className='p-4 sm:p-6 dark:bg-gray-900 flex-grow container mx-auto px-10 m-0 sm:px-6 transition ease-in-out duration-500'>
        <div className="max-w-7xl py-10 px-6 sm:px-6 lg:px-8 mx-auto lg:max-w-screen-xl block sm:flex text-center items-center justify-center">
            <div className="mx-auto sm:max-w-screen-sm text-center">
                <div className='transition duration-700 ease-in-out'>
                    { showSuccessMessage ? ( 
                        <div className='flex flex-col my-8'>
                            <div className='flex mb-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 mr-2 text-green-500">
                                    <circle fill="currentColor" cx="12" cy="12" r="11"/>
                                    <path fill="#FFF" d="M17.83 7.8L10.587 15.043l-3.23-3.23a.984.984 0 0 0-1.392 0 .984.984 0 0 0 0 1.392l3.59 3.59a.984.984 0 0 0 1.392 0l7.667-7.667a.984.984 0 0 0 0-1.392.984.984 0 0 0-1.392 0z"/>
                                </svg>

                                <p className="custom-success-message font-semibold dark:text-white text-sm italic">Subscribed Successfully!</p>
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
                                    {' '}Thanks for subscribing!
                                </span>
                                </Alert>
                            </div>
                        </div>
                    ) : 
                    (
                    <>
                        <div className="lg:text-center">
                            <h2 className="text-3xl leading-8 font-extrabold tracking-tight lg:text-4xl text-pink-500 dark:text-indigo-400 uppercase">
                                Subscribe to our newsletter
                            </h2>
                            <p className="lg:text-lg text-sm mt-2 leading-8 font-semibold tracking-wide text-white dark:text-gray-400">
                                Stay up-to-date with our latest news and articles.<br />Read our articles directly inside your inbox.
                            </p>
                            <p className="mt-4 max-w-2xl lg:text-xl text-md text-white dark:text-gray-400 lg:mx-auto">
                                Sign up for our newsletter to receive updates on new products,
                                promotions, and events. Don't miss out.
                            </p>
                        </div>
                        <div className="mt-10">
                            <form onSubmit={handleSubmit} className="relative w-full sm:flex items-center justify-center">
                                <label htmlFor="email-address" className="sr-only">
                                Email address
                                </label>
                                <HiMail className="w-6 h-6 top-3 left-2 lg:ml-8 md:ml-8 sm:-ml-4 lg:mt-0 md:mt-0 sm:mt-0 absolute lg:left-20 sm:left-20 text-gray-500 dark:text-gray-400" />
                                <input
                                    id="email-address"
                                    name="email-address"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none w-full pl-10 px-4 py-3 text-gray-700 rounded-md shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:max-w-xs bg-gray-200 dark:bg-gray-800 dark:shadow-inner dark:shadow-[-60px_60px_600px_50px_rgba(0,10,9,0.3)] dark:focus:shadow-[-60px_6px_500px_80px_rgba(80,10,100,0.3)] transition ease-in-out duration-700 dark:text-gray-200 border border-gray-200 dark:border-none focus:bg-white dark:focus:bg-gray-800 focus:border-gray-500 dark:focus:border-gray-500 focus:shadow-outline font-normal"
                                    placeholder="Enter your email here..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                    <button
                                    type="submit"
                                    className="mt-3 w-full px-4 py-3 text-base font-medium text-white bg-indigo-600 rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Subscribe
                                    </button>
                            </form>
                        </div>
                    </>
                    )
                    }
                </div>
            </div>
        </div>
    </section>
)
}

export default Subscribe