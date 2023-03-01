import Image from 'next/image';

const Logo = () => {
    return (
        <>
        <Image
            alt="Programmers Life logo"
            src="/logo.png"
            width={50}
            height={50}
            className='rounded-full cursor-pointer mr-0'
          />
          <span className="self-center whitespace-nowrap px-3 text-md font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Programmers Life
          </span>
        </>
    )
}

export default Logo;
