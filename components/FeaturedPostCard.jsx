import React from 'react';
import moment from 'moment';

import Link from 'next/link';

const FeaturedPostCard = ({ post }) => {
    return (
        <div className="relative h-72 shadow-lg cursor-pointer hover:opacity-80 transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:z-50 hover:rounded-lg">
            <div className="absolute rounded-lg bg-center bg-no-repeat bg-cover inline-block w-full h-72" style={{ backgroundImage: `url('${post.featuredImage.url}')` }} />
            <div className="absolute rounded-lg bg-center bg-gradient-to-b opacity-50 from-gray-400 via-gray-700 to-black w-full h-72" />
        <div className="flex flex-col rounded-lg p-4 items-center justify-center absolute w-full h-full">
        <p className="text-white mb-4 text-shadow font-semibold text-xs">{moment(post.createdAt).format('MMM DD, YYYY')}</p>
        <p className="text-white mb-4 text-shadow font-semibold text-sm text-center">{post.title}</p>
        <div className="flex items-center absolute bottom-5 w-full justify-center">
            <img
            alt={post.author.name}
            height="30px"
            width="30px"
            className="align-middle drop-shadow-lg rounded-full"
            src={post.author.photo.url}
            />
            <p className="inline align-middle text-white text-shadow ml-2 text-xs">{post.author.name}</p>
        </div>
        </div>
        <Link href={`/post/${post.slug}`}><span className="cursor-pointer absolute w-full h-full" /></Link>
    </div>
    )
}

export default FeaturedPostCard;