import React from 'react'

const Logo = () => {
    return (
        <div className='flex justify-between items-center'>
        <img
            alt="Programmers Life logo"
            src="/logo.png"
            width={50}
            height={50}
            className='rounded-full cursor-pointer mr-0'
          />
          <span className="self-center whitespace-nowrap px-3 text-md font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Programmers Life
          </span>
        </div>
    )
}

export default Logo;
