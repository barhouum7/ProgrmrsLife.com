import React from 'react'
import Image from 'next/image';
import Link from 'next/link'

const success = () => {
  return (
    <div className='dark:bg-gray-800 container relative flex-grow rounded-t mx-auto transition ease-in-out duration-500'>
        <section className="dark:bg-gray-900 rounded w-full h-full py-10">
            <div className="max-w-7xl py-10 px-6 sm:px-6 lg:px-8 mx-auto lg:max-w-screen-xl block sm:flex text-center items-center justify-center">
                <div className="mx-auto sm:max-w-screen-sm text-center">
                    <h1 className="mb-4 tracking-tight font-extrabold text-4xl md:text-6xl text-green-300 dark:text-green-300">Post Shared Successfully!</h1>
                    <p className="mb-4 text-2xl tracking-tight font-bold text-white md:text-3xl dark:text-white">Thank you for sharing our post!</p>
                    <p className="mb-4 text-md md:text-lg text-white dark:text-gray-400">Your support means the world to us. <br/><br/>If you enjoyed this content, consider subscribing to our newsletter to receive more articles like this one in your inbox every week.<br/><br/> We also encourage you to join the conversation by leaving your thoughts and comments in post page, or on our social media channels.</p>
                </div>
                <Image
                    alt="Successfully done"
                    src="/imgs/successfully-done.gif"
                    width={300}
                    height={300}
                    className='cursor-pointer ml-0 mr-0 sm:ml-0 sm:mr-0'
                />
            </div>
            <div className="sm:flex flex items-center justify-center mt-0">
                <Link href="/" className="inline-flex text-white bg-primary-600 hover:bg-pink-600 focus:outline-none active:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4 transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:z-50 inline-flex self-center text-md font-semibold text-gray-700 hover:text-white dark:text-gray-100 hover:bg-pink-600 dark:hover:bg-pink-600 focus:outline-none active:bg-blue-600 rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4 transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:z-50 bg-gradient-to-r from-pink-500 to-transparent">Back to Homepage</Link>
            </div>
        </section>
    </div>
  )
}

export default success