import React from 'react'
import Image from 'next/image';

const Logo = () => {
    return (
        <div className='flex justify-between items-center'>
        <Image
            alt="Programmers Life logo"
            src="/imgs/logo.svg"
            width={40}
            height={40}
            className='rounded-full cursor-pointer mr-0'
          />
          <span className="self-center whitespace-nowrap px-3 text-md font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Programmers Life
          </span>
        </div>
    )
}

export default Logo;
