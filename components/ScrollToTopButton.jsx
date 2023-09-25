import React, { useState, useEffect } from "react";
// import { FiChevronUp } from "react-icons/fi";
// import { BsChevronUp } from "react-icons/bs";
// import { FaChevronUp } from "react-icons/fa";
// import { IoChevronUp } from "react-icons/io5";
import { TiArrowUp } from "react-icons/ti";
import { Tooltip } from "flowbite-react";

const ScrollToTopButton = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const currentPosition = window.pageYOffset;
      setScrollPosition(currentPosition);
      if (currentPosition > 100) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };


  return (
    <>
      {showScroll && (
          <button className="fixed bottom-40 right-3 w-12 h-12 rounded-full border-none bg-gray-800 hover:bg-gray-900 cursor-pointer z-20 transform hover:scale-110 hover:shadow-2xl hover:z-10 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 active:bg-gray-700 transition duration-300 ease-in-out" onClick={scrollToTop}>
            {/* <FiChevronUp className="text-white text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" /> */}
            {/* <BsChevronUp className="text-white text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" /> */}
            {/* <FaChevronUp className="text-white text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" /> */}
            {/* <IoChevronUp className="text-white text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" /> */}
            {/* <MdKeyboardArrowUp className="text-white text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" /> */}
            <Tooltip content="Scroll to top☝" placement="left" style="dark" className="text-xs transition duration-700 ease-in-out">
              <TiArrowUp className="text-white text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              <svg stroke="currentColor" strokeWidth="4" className="relative w-full h-full fill-none" viewBox="-1 -1 102 102">
                <path stroke="currentColor" className="text-gray-500" d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />

                <path
                  stroke="currentColor"
                  className="progress"
                  d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
                  style={{ strokeDashoffset: `calc(307.919 - (307.919 * ${(typeof document !== 'undefined' && (scrollPosition / (document.body.scrollHeight - window.innerHeight)) * 100) || 0}) / 100)` }}
                />
              </svg>
            </Tooltip>
          </button>
      )}
      <style jsx>{`

      .progress {
        stroke-dasharray: 307.919, 307.919;
        stroke-dashoffset: 283.171;

        stroke: #c3dafe;
        stroke-width: 4;
        stroke-linecap: round;
  
      }
      `}</style>
    </>
  );
};

export default ScrollToTopButton;