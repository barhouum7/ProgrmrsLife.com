import React from 'react'

const Author = ({ author }) => {
  return (
        <div className='text-center z-30 mt-20 mb-8 p-12 relative bg-black bg-opacity-20 dark:bg-opacity-30 rounded-lg shadow-xl lg:p-8 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl'>
            <div className="absolute -z-20 inset-0 bg-white opacity-0 rounded-lg shadow-2xl animated w-2 h-15"></div>
            <div className="relative z-30 p-6">
                <div className='transition duration-700 ease-in-out flex justify-center absolute right-20 left-20 -top-20'>
                    <img
                        src={author.photo.url}
                        alt={author.name}
                        className="rounded-full align-middle inset-0 object-contain transition duration-700 ease-in-out transform hover:scale-110 hover:shadow-2xl hover:z-10 cursor-pointer"
                        width={100}
                        height={100}
                    />
                </div>
                <h3 className='text-white font-bold py-4 text-xl'>{author.name}</h3>
                <p className='text-gray-100 dark:text-gray-400 sm:text-sm md:text-lg'>{author.bio}</p>
            </div>
        </div>
  )
}

export default Author