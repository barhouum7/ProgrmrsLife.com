import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Link from 'next/link';
import Image from 'next/image';
import { grpahCMSImageLoader } from '@/util';

const FeaturedPostCard = ({ post }) => {
    return (
        <div className="relative h-72 shadow-lg cursor-pointer hover:opacity-80 transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:z-50 hover:rounded-lg">
            <div className="absolute rounded-lg bg-center bg-no-repeat bg-cover inline-block w-full h-72" style={{ backgroundImage: `url('${post.featuredImage.url}')` }} />
            <div className="absolute rounded-lg bg-center bg-gradient-to-b opacity-50 from-gray-400 via-gray-700 to-black w-full h-72" />
        <div className="flex flex-col rounded-lg p-4 items-center justify-center absolute w-full h-full">
        <p className="text-white mb-4 text-shadow font-semibold text-xs">{moment(post.createdAt).format('MMM DD, YYYY')}</p>
        <p className="text-white mb-4 text-shadow font-semibold text-sm text-center">{post.title}</p>
        <div className="flex items-center absolute bottom-5 w-full justify-center">
            <div className="relative w-8 h-8">
                <Image
                    loader={grpahCMSImageLoader}
                    alt={post.author.name}
                    src={post.author.photo.url}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-full object-cover border-none shadow-lg cursor-pointer hover:opacity-80 transition duration-300 ease-in-out"
                    loading='lazy'
                />
            </div>
            <p className="inline align-middle text-white text-shadow ml-2 text-xs">{post.author.name}</p>
        </div>
        </div>
        <Link href={`/post/${post.slug}`}><span className="cursor-pointer absolute w-full h-full" /></Link>
    </div>
    )
}

FeaturedPostCard.propTypes = {
    post: PropTypes.shape({
        title: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        author: PropTypes.shape({
            name: PropTypes.string.isRequired,
            photo: PropTypes.shape({
                url: PropTypes.string.isRequired,
            }).isRequired,
        }).isRequired,
        featuredImage: PropTypes.shape({
            url: PropTypes.string.isRequired,
        }).isRequired,
        slug: PropTypes.string.isRequired,
    }).isRequired,
};


export default FeaturedPostCard;