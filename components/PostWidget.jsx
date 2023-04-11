import React, { useState, useEffect } from 'react'
import moment from 'moment'
import Link from 'next/link'

import { getRecentPosts, getSimilarPosts } from '../services'

const PostWidget = ({ categories, slug }) => {
    const [relatedPosts, setRelatedPosts] = useState([])
    useEffect(() => {
        if (slug) {
            getSimilarPosts(categories, slug)
                .then((result) => setRelatedPosts(result))
                .catch((err) => console.log(err))
            } else {
                getRecentPosts()
                    .then((result) => setRelatedPosts(result))
                    .catch((err) => console.log(err))
            }        
    }, [slug])
    
    // console.log(relatedPosts)

    return (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl hover:shadow-indigo-500/40 p-8 mb-8 transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-100 hover:shadow-2xl hover:z-10'>
            <h3 className='text-xl font-semibold border-b pb-4 mb-8'>
                {slug ? 'Related Posts' : 'Recent Posts'}
            </h3>
            {relatedPosts.length > 0 && relatedPosts.map((post) => (
                <div key={post.title} className='flex items-center w-full mb-4'>
                    <div className="w-10 flex-none rounded-full">
                        <img 
                            alt={post.title}
                            height={50}
                            width={50}
                            src={post.featuredImage.url}
                            className='align-middle h-10 rounded-full object-cover border-none shadow-lg cursor-pointer mr-0'
                        />
                    </div>
                    <div className="flex-grow flex-col ml-4">
                        <p className='text-gray-500 dark:text-gray-400 font-xs'>
                            {moment(post.createdAt).format('MMMM DD, YYYY')}
                        </p>
                        <Link href={`/post/${post.slug}`}>
                            <p className='text-md font-semibold text-violet-700 hover:text-pink-300 dark:hover:text-pink-300 cursor-pointer dark:text-gray-400 transition duration-700'>
                                {post.title}
                            </p>
                        </Link>
                    </div>
                </div>
            ))}
            {relatedPosts.length === 0 && (
                <p className='text-gray-500 dark:text-gray-400 font-xs'>
                    Loading posts...
                </p>
            )
            }

        </div>
    )
}

export default PostWidget