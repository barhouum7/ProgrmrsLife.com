import React, {useState} from 'react'
import { Alert, Tooltip } from "flowbite-react";
import {HiMail, HiUser} from "react-icons/hi";
import { submitEmail } from '../services'
import Link from 'next/link';


const Subscribe = () => {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Your newsletter subscription logic here

        const emailObj = {
            name: name,
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
    <section className='p-4 sm:p-6 dark:bg-gray-900 mx-4 px-10 m-0 sm:px-6'>
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
                                    {' '}Thanks for subscribing! We&apos;ll be in touch soon.
                                </span>
                                </Alert>
                            </div>
                        </div>
                    ) : 
                    (
                    <>
                        <div className="lg:text-center">
                            <h2 className="text-3xl leading-8 font-semibold tracking-tight lg:text-4xl text-pink-500 dark:text-indigo-400 uppercase">
                                Subscribe to our newsletter
                            </h2>
                            <p className="lg:text-lg text-sm mt-2 leading-8 font-semibold tracking-wide text-white dark:text-gray-400">
                                Stay up-to-date with our latest news and articles.<br />Read our articles directly inside your inbox.
                            </p>
                            <p className="mt-4 max-w-2xl lg:text-xl text-md text-white dark:text-gray-400 lg:mx-auto">
                                Sign up for our newsletter to receive updates on new products,
                                promotions, and events. Don&apos;t miss out.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 mt-12">
                            <form onSubmit={handleSubmit} className="sm:flex items-center justify-center">
                                <div className='sm:flex justify-center'>
                                    {/* Name Input */}
                                    <div className='relative mr-3'>
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
                                        style="dark"
                                        >
                                            <div className='flex'>
                                                <label htmlFor="name" className="block text-white dark:text-gray-400 font-bold mb-2">
                                                    Name
                                                </label>
                                                <span className='ml-1 mt-1 text-green-300 dark:text-gray-400'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                </span>
                                            </div>
                                        </Tooltip>
                                        <HiUser className="w-5 h-5 absolute top-11 left-1 lg:left-1 sm:left-1 text-gray-500 dark:text-gray-400" />
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder='Enter your name here...'
                                            className="pl-8 block w-full bg-gray-200 dark:bg-gray-800 text-gray-700 shadow-xl focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:max-w-xs dark:shadow-inner dark:shadow-[-60px_60px_600px_50px_rgba(0,10,9,0.3)] dark:focus:shadow-[-60px_6px_500px_80px_rgba(80,10,100,0.3)] dark:text-gray-200 border dark:border-none rounded-md py-3 px-4 mb-2 focus:outline-none focus:bg-white dark:focus:bg-gray-800 border-gray-200 focus:border-indigo-500 dark:focus:border-indigo-500 focus:shadow-outline transition ease-in-out duration-700 resize-none font-normal"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            autoComplete='true'
                                        />
                                    </div>
                                    {/* Email Input */}
                                    <div className='relative'>
                                        <Tooltip
                                        content={
                                            <div>
                                                Please enter your email address to Subscribe!<br />
                                                <p className='flex'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-1">
                                                        <path fill="lightgreen" d="M12 22c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zm0-2c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zM11 7h2v6h-2zm0 8h2v2h-2z"/>
                                                    </svg>
                                                    Don&apos;t worry, we&apos;ll never share it.
                                                </p>
                                                <br />Read our&nbsp;<Link href='/privacyPolicy' className='text-indigo-700 hover:text-pink-300 dark:hover:text-pink-300 cursor-pointer dark:text-indigo-500 transition duration-700'>Privacy Policy</Link>.
                                            </div>
                                        }
                                        style="dark"
                                        >
                                            <div className='flex'>
                                                <label htmlFor="email-address" className="block text-white dark:text-gray-400 font-bold mb-2">
                                                    Email
                                                </label>
                                                <span className='ml-1 mt-1 text-green-300 dark:text-gray-400'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                </span>
                                            </div>
                                        </Tooltip>
                                        {/* <HiMail className="w-6 h-6 top-3 left-2 lg:ml-8 md:ml-8 sm:-ml-4 lg:mt-0 md:mt-0 sm:mt-0 absolute lg:left-20 sm:left-20 text-gray-500 dark:text-gray-400" /> */}
                                        <HiMail className="w-6 h-6 absolute top-11 left-1 lg:left-1 sm:left-1 text-gray-500 dark:text-gray-400" />
                                        <input
                                            id="email-address"
                                            name="email-address"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="pl-8 block w-full px-4 py-3 text-gray-700 rounded-md shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:max-w-xs bg-gray-200 dark:bg-gray-800 dark:shadow-inner dark:shadow-[-60px_60px_600px_50px_rgba(0,10,9,0.3)] dark:focus:shadow-[-60px_6px_500px_80px_rgba(80,10,100,0.3)] transition ease-in-out duration-700 dark:text-gray-200 border border-gray-200 dark:border-none focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:shadow-outline resize-none font-normal outline-none"
                                            placeholder="Enter your email here..."
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className='mt-6'>
                                    <button
                                    type="submit"
                                    className="px-4 py-3 text-base font-medium text-white bg-indigo-600 rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Subscribe
                                    </button>
                                </div>
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