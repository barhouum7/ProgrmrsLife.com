import React, { useState, useEffect } from 'react'
import { RichText } from '@graphcms/rich-text-react-renderer';
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
    const avatars = [
    `https://www.gravatar.com/avatar/${ hash }?s=200&d=retro`,
    `https://www.gravatar.com/avatar/${ hash }?s=200&d=identicon`,
    `https://www.gravatar.com/avatar/${ hash }?s=200&d=monsterid`,
    `https://www.gravatar.com/avatar/${ hash }?s=200&d=robohash`,
    `https://www.gravatar.com/avatar/${ hash }?s=200&d=wavatar`,
    // `https://www.gravatar.com/avatar/${ hash }?s=200&d=blank`,
    `https://www.gravatar.com/avatar/${ hash }`,
    
];
    

    
    const avatar = Math.floor( Math.random() * avatars.length );
    
    return avatars[avatar];

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
                                // facebookId={comment.name}
                                // googleId="118096717852922241760"
                                // githubHandle={comment.name}
                                // twitterHandle={comment.name}
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
                        {comment.comments !== null && comment.comments.raw.children && (
                            <RichText
                            content={comment.comments.raw.children}
                            renderers={{
                                p: ({ children }) => <p className='whitespace-pre-line text-gray-600 dark:text-gray-400 w-full'>{children}</p>,
                                a: ({ children, openInNewTab, href, rel, ...rest }) => {
                                    if (href.match(/^https?:\/\/|^\/\//i)) {
                                    return (
                                            <a
                                            className='text-indigo-700 hover:text-pink-300 dark:hover:text-pink-300 cursor-pointer dark:text-indigo-500 transition duration-500'
                                            href={href}
                                            target={openInNewTab ? '_blank' : '_self'}
                                            rel={rel || 'noopener noreferrer'}
                                            {...rest}
                                            >
                                                {children}
        
                                            </a>
                                    );
                                    }
        
                                    return (
                                            <Link href={href}>
                                                <a {...rest}>{children}</a>
                                            </Link>
                                    );
                                },
                                h1: ({ children }) => <h1 className="text-3xl font-semibold">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-1xl font-semibold">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-xl font-semibold">{children}</h3>,
                                h4: ({ children }) => <h4 className="text-xl font-semibold my-4">{children}</h4>,
                                h5: ({ children }) => <h5 className="text-gray-700 dark:text-gray-300 font-semibold">{children}</h5>,
                                h6: ({ children }) => <h6 className="text-gray-700 dark:text-gray-300 font-semibold">{children}</h6>,
                                bold: ({ children }) => <span className="font-semibold text-sm text-gray-900 dark:text-gray-400">{children}</span>,
                                italic: ({ children }) => <em className="post-detail-em relative text-gray-900 dark:text-white mr-0">{children}</em>,
                                code: ({ children }) => <code className="bg-gray-200 dark:bg-gray-600 px-2 py-0 rounded font-mono text-sm text-gray-900 dark:text-gray-100">{children}</code>,
                                blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-200 dark:border-gray-600 pl-4 my-4">{children}</blockquote>,
                                ul: ({ children }) => <ul className="list-disc list-inside">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside">{children}</ol>,
                                li: ({ children }) => <li className="text-gray-900 dark:text-gray-100">{children}</li>,
                                img: ({ src }) => <img className="w-full h-full cursor-pointer shadow-lg rounded-lg hover:shadow-2xl my-4" src={src} />,

                            }}
                            />
                        )}
                    </div>
                ))}
            </div>
            )}
        </div>
    )
}

export default Comments