import React from 'react'
import Image from 'next/image';
import Link from 'next/link'

const Error404_pageNF = () => {
  return (
    <div className='dark:bg-gray-800 container relative flex-grow rounded-t mx-auto transition ease-in-out duration-500'>
        <section className="dark:bg-gray-900 rounded w-full h-full">
            <div className="py-10 px-6 mx-auto lg:max-w-screen-xl block sm:flex text-center items-center justify-center">
                <div className="mx-auto sm:max-w-screen-sm text-center">
                    <h1 className="mb-4 tracking-tight font-extrabold text-4xl md:text-8xl text-red-400 dark:text-red-400">404 Not Found</h1>
                    <p className="mb-4 text-2xl tracking-tight font-bold text-white md:text-4xl dark:text-white">Whoops! That page doesn't exist.</p>
                    <p className="mb-4 text-md md:text-lg font-light text-gray-100 dark:text-gray-400">Sorry, we still working on that page. You'll find lots to explore on the home page. </p>
                    <Link href="/" className="inline-flex text-white bg-primary-600 hover:bg-pink-600 focus:outline-none active:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4 transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:z-50 inline-flex self-center text-md font-semibold text-gray-700 hover:text-white dark:text-gray-100 hover:bg-pink-600 dark:hover:bg-pink-600 focus:outline-none active:bg-blue-600 rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4 transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:z-50 bg-gradient-to-r from-pink-500 to-transparent">Back to Homepage</Link>
                </div>
                <Image
                    alt="Error 404 Page Not Found"
                    src="/imgs/404-computer.svg"
                    width={500}
                    height={500}
                    className='cursor-pointer ml-0 mr-0 sm:ml-0 sm:mr-0 w-1/1 md:w-full'
                />
            </div>
        </section>
    </div>
  )
}

export default Error404_pageNF