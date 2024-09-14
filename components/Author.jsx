import React from 'react'
import PropTypes from 'prop-types';
import Image from 'next/image';

const Author = ({ author }) => {
  return (
        <div className='text-center mt-20 mb-8 p-12 relative bg-black bg-opacity-60 dark:bg-opacity-30 rounded-lg shadow-xl lg:p-8 hover:shadow-indigo-500/40 hover:shadow-2xl'>
            <div className="absolute -z-20 inset-0 bg-white opacity-0 rounded-lg shadow-2xl animated w-2 h-15"></div>
            <div className="relative p-6">
                <div className='transition duration-700 ease-in-out flex justify-center absolute right-20 left-20 -top-20'>
                <div className='relative w-[100px] h-[100px]'>
                    <Image
                        src={author.photo.url}
                        alt={author.name}
                        fill
                        className="object-cover rounded-full transition duration-700 ease-in-out transform hover:scale-110 hover:shadow-2xl hover:z-10 cursor-pointer"
                    />
                    <div className='absolute inset-0 rounded-full hover:bg-purple-500 hover:bg-opacity-50 hover:animate-ping bg-transparent dark:hover:bg-purple-400 transition-all duration-300 cursor-pointer'></div>
                </div>
                </div>
                <h3 className='text-white font-bold py-4 text-xl'>{author.name}</h3>
                <p className='text-gray-100 dark:text-gray-400 sm:text-sm md:text-lg'>{author.bio}</p>
            </div>
        </div>
  )
}

Author.propTypes = {
    author: PropTypes.shape({
        photo: PropTypes.shape({
            url: PropTypes.string.isRequired,
        }),
        name: PropTypes.string.isRequired,
        bio: PropTypes.string.isRequired,
    }).isRequired,
};

export default Author