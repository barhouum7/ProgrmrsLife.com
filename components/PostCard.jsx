import React from 'react'
import moment from 'moment'

import Link from 'next/link'

const PostCard = ({post}) => {

    function getMinutesRead(text) {
        const words = text.split(' ').length;
        const wordsPerMinute = 10;
        const minutes = Math.round(words / wordsPerMinute);
        return minutes;
    }


    // console.log(post.excerpt)

  return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-0 lg:p-8 pb-12 mb-8">
            <div className="relative overflow-hidden shadow-md pb-80 mb-6">
            <Link href={`/post/${post.slug}`}>
                <img 
                    src={post.featuredImage.url}
                    alt={post.title}
                    className="absolute shadow-lg rounded-t-lg lg:rounded-lg w-full h-80 object-top object-cover cursor-pointer hover:opacity-80 transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:z-50 hover:rounded-lg hover:rounded-b-none hover:rounded-r-none hover:rounded-l-none hover:rounded-t-none hover:rounded-tl-none hover:rounded-tr-none hover:rounded-bl-none hover:rounded-br-none"
                />
            </Link>
            </div>
            <h1 className="transition duration-700 text-center cursor-pointer dark:text-gray-400 dark:hover:text-pink-300 text-violet-700 hover:text-pink-300 text-3xl font-semibold mb-8">
            <Link href={`/post/${post.slug}`}>
                {post.title}
            </Link>
            </h1>
            <div className="block lg:flex text-center items-center justify-center mb-8 w-full">
                <div className="flex items-center justify-center mb-4 lg:mb-0 w-full lg:w-auto mr-8">
                    <img
                        alt={post.author.name}
                        height="30"
                        width="30"
                        src={post.author.photo.url}
                        className="rounded-full align-middle border-none shadow-lg cursor-pointer"
                    />
                    <p className="inline align-middle text-gray-700 dark:text-gray-200 ml-2 text-lg">{post.author.name}</p>
                </div>
                <div className="flex items-center justify-center w-full lg:w-auto font-medium text-gray-700 dark:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                        {moment(post.date).format('MMMM Do YYYY')}
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
                        {getMinutesRead(post.excerpt)} min read
                    </span>
                </div>
            </div>
            <p className="text-center text-lg text-gray-700 dark:text-gray-200 font-normal px-4 lg:px-20 mb-8">{post.excerpt}</p>
            <div className='text-center'>
            <Link href={`/post/${post.slug}`}>
                <p className="inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer dark:hover:text-primary-500 transition duration-700 transform ease-in-out hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:z-50">Continue Reading</p>
            </Link>
            </div>
        </div>
  )
}

export default PostCard