import React from 'react'
import Image from 'next/image';
import Link from 'next/link'

const Error404_pageNF = () => {
  return (
    <div>
        <section className="dark:bg-gray-900 block lg:flex text-center items-center justify-center mt-20 rounded-tr rounded-bl w-full">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-10 lg:px-6 flex text-center items-center justify-center">
                <Image
                    alt="Error 404 Page Not Found"
                    src="/imgs/404-computer.svg"
                    width={500}
                    height={500}
                    classNameName='rounded-full cursor-pointer mr-0'
                />
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-8xl text-red-400 dark:text-red-400">404 Not Found</h1>
                    <p className="mb-4 text-3xl lg:text-4xl tracking-tight font-bold text-white md:text-4xl dark:text-white">Whoops! That page doesn't exist.</p>
                    <p className="mb-4 text-lg font-light text-gray-100 dark:text-gray-400">Sorry, we still working on that page. You'll find lots to explore on the home page. </p>
                    <Link href="/" className="inline-flex text-white bg-primary-600 hover:bg-pink-600 focus:outline-none active:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4 transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:z-50">Back to Homepage</Link>
                </div>   
            </div>
        </section>
    </div>
  )
}

export default Error404_pageNF