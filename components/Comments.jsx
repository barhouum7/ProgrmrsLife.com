import React, { useState, useEffect } from 'react'
import moment from 'moment'
import parser from 'html-react-parser'
import Avatar from 'react-avatar';
import md5 from 'md5'

import { getComments } from '../services'

const Comments = ({ slug }) => {
    const [comments, setComments] = useState([])
    useEffect(() => {
        getComments(slug)
            .then((result) => setComments(result))
    }, [])


    const getGravatarURL = ( email ) => {
    // Trim leading and trailing whitespace from
    // an email address and force all characters
    // to lower case
    const address = String( email ).trim().toLowerCase();

    // Create an MD5 hash of the final string
    const hash = md5( address );

    // Grab the actual image URL
    return `https://www.gravatar.com/avatar/${ hash }`;
    }


    return (
        <div>
            { comments.length > 0 && (
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 sm:p-8 pb-12 m-0 mb-8 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl'>
                <h3 className='text-xl mb-8 border-b pb-4 font-semibold text-gray-900 dark:text-gray-200'>
                    {comments.length <= 9 ? (
                        <span className='text-md rounded-full py-1 px-3 bg-gradient-to-r from-pink-500 to-transparent cursor-pointer'>{comments.length}+</span>
                    )
                    : 
                    (
                        <span className='text-md rounded-full py-2 px-3 bg-gradient-to-r from-pink-500 to-transparent cursor-pointer'>{comments.length}+</span>
                    )}
                    {' '}
                    Comments
                </h3>
                {comments.map((comment) => (
                    <div key={comment.createdAt} className='border-b border-gray-100 dark:border-gray-700 mb-4 pb-4'>
                        {/* {console.log(comment.email)} */}
                        <div className='mb-4'>
                            <span className='mr-1'>
                                <Avatar 
                                name={comment.name}
                                size="40"
                                round={true}
                                color="#5E60CE"
                                fgColor="#F1F1F1"
                                className='cursor-pointer'
                                facebook-id="invalidfacebookusername"
                                src={getGravatarURL(comment.email)}
                                />
                            </span>
                            {' '}
                            <span className='font-semibold'>{comment.name}</span>
                            {' '}
                            &nbsp;•&nbsp;
                            {' '}
                            <span className='text-gray-500 dark:text-gray-400'>{moment(comment.createdAt).fromNow()}</span>
                        </div>
                        <p className='whitespace-pre-line text-gray-600 dark:text-gray-400 w-full'>{parser(comment.comment)}</p>
                    </div>
                ))}
            </div>
            )}
        </div>
    )
}

export default Comments