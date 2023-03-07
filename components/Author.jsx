import React from 'react'

const Author = ({ author }) => {
  return (
    <div className='logo-container text-center mt-20 mb-8 p-12 relative rounded-lg bg-black bg-opacity-20 dark:bg-opacity-30 dark:text- rounded-lg shadow-xl lg:p-8 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl'>
        <div className='logo-image animate-spin-slow animate-[spin_3s_ease-in-out_infinite] hover:animate-none transition duration-700 ease-in-out flex justify-center absolute right-20 left-20 -top-14'>
            <img
                src={author.photo.url}
                alt={author.name}
                className="rounded-full align-middle inset-0 object-contain transition duration-700 ease-in-out transform hover:scale-110 hover:shadow-2xl hover:z-10 cursor-pointer"
                width={100}
                height={100}
            />
        </div>
        <h3 className='text-white font-bold py-4 text-xl'>{author.name}</h3>
        <p className='text-gray-100 dark:text-gray-400 text-lg'>{author.bio}</p>
    </div>
  )
}

export default Author