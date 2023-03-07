import React from 'react'
import Image from 'next/image';

const Logo = () => {
    return (
        <div className='flex justify-between items-center relative hover:animate-none animate-[spin_3s_ease-in-out_infinite]'>
        <Image
            alt="Programmers Life logo"
            src="/imgs/logo.svg"
            width={40}
            height={40}
            className='rounded-full cursor-pointer mr-0 inset-0 object-contain transition duration-700 ease-in-out transform hover:scale-110 hover:shadow-2xl hover:z-10'
          />
        </div>
    )
}

export default Logo;
