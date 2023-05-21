import React, { useState, useRef, useEffect } from "react";
import { Tooltip } from "flowbite-react";

const ChatWithAIButton = () => {
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [showTNAi, setShowTNAi] = useState(false);
  const [showProgrammerAi, setShowProgrammerAi] = useState(false);
  const popupRef = useRef(null); // Reference to the popup window container

  const onProgrammerAiButtonClick = () => {
    setShowProgrammerAi(true);
  };

  const onTNAiButtonClick = () => {
    setShowTNAi(true);
  };

  const onChatWithAIButtonClick = () => {
    setShowChatWindow(true);
  };

  const onCloseButtonClick = () => {
    setShowChatWindow(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keyup', (event) => {
      if (event.key === 'Escape') {
          setShowChatWindow(false);
      }
      });
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowChatWindow(false);
        setShowProgrammerAi(false);
        setShowTNAi(false);
      }
    };

    if (showChatWindow) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showChatWindow]);

  return (
    <>
    <div className="fixed bottom-5 right-10 w-12 h-12 rounded-full border-none bg-gray-800 hover:bg-gray-900 cursor-pointer transform hover:scale-110 hover:shadow-2xl hover:z-10 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 active:bg-gray-700 transition duration-300 ease-in-out">
    <div className='w-full h-full rounded-full align-middle absolute top-0 hover:bg-purple-500 hover:bg-opacity-50 bg-purple-400 dark:hover:bg-purple-400 bg-opacity-50 animate-ping-slow cursor-pointer'></div>
      <Tooltip
            content="Chat with AI"
            placement="left"
            style="dark"
            className="text-xs transition duration-700 ease-in-out"
        >
              <button
                  className="cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  onClick={onChatWithAIButtonClick}
                >
                    <span className="text-white text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      🤖
                    </span>
                {/* <svg
                  className="text-white text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg> */}
            </button>
          </Tooltip>
    </div>

      {showChatWindow && (
            <div ref={popupRef} style={{ height: "550px", width: "1100px" }} className="fixed bottom-0 right-0 p-4 rounded-tl-3xl border-none shadow-2xl z-50 flex flex-col justify-center items-center bg-gray-800">
              {!showTNAi && !showProgrammerAi && (
                <button 
                className="mb-2 w-1/2 h-12 rounded-full border-none bg-gray-700 hover:bg-gray-900 cursor-pointer transform hover:scale-110 hover:shadow-2xl hover:z-10 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 active:bg-gray-700 transition duration-300 ease-in-out"
                onClick={onTNAiButtonClick}
              >
                <span className="text-white">
                  Tunisian's Dialect ChatGPT-4 Assistant 🇹🇳
                </span>
              </button>
              )}
              {showTNAi && (
                <>
                  <span className="text-white text-md mb-2">
                    Tunisian's Dialect ChatGPT-4 Assistant 🇹🇳
                  </span>
                    <div style={{ height: "500px", width: "1000px" }} className="mr-2 shadow-inner shadow-[-60px_60px_600px_50px_rgba(0,10,9,0.3)] hover:shadow-[-60px_6px_500px_80px_rgba(80,10,100,0.3)]">
                    <iframe
                        src={`https://ora.ai/embed/e15e194c-088d-4413-92fe-642f8359cf51`}
                        width="100%"
                        height="100%"
                        style={{ border: "0", borderRadius: "4px" }}
                    />
                  </div>
                </>
              )}
              {/* ******* Programmer AI BOT ******** */}
              {!showProgrammerAi && !showTNAi && (
                <button 
                className="mb-2 w-1/2 h-12 rounded-full border-none bg-gray-700 hover:bg-gray-900 cursor-pointer transform hover:scale-110 hover:shadow-2xl hover:z-10 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 active:bg-gray-700 transition duration-300 ease-in-out"
                onClick={onProgrammerAiButtonClick}
              >
                <span className="text-white">
                  Programmers Life ChatGPT-4 👨‍💻
                </span>
              </button>
              )}
              {showProgrammerAi && (
                <>
                  <span className="text-white text-md mb-2">
                  Programmers Life ChatGPT-4 👨‍💻
                  </span>
                  <div style={{ height: "500px", width: "600px" }} className="mr-2 shadow-inner shadow-[-60px_60px_600px_50px_rgba(0,10,9,0.3)] hover:shadow-[-60px_6px_500px_80px_rgba(80,10,100,0.3)]">
                      <iframe
                          src={`https://ora.ai/embed/3dd613cd-73df-4abc-a254-bc4e0497c623`}
                          width="100%"
                          height="100%"
                          style={{ border: "0", borderRadius: "4px" }}
                      />
                  </div>
                </>
              )}
              {
                !showProgrammerAi && !showTNAi && (
                  <button
                    className="absolute bottom-10 w-1/2 h-12 rounded-full border-none bg-gray-800 hover:bg-gray-900 cursor-pointer transform hover:scale-110 hover:shadow-2xl hover:z-10 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 active:bg-gray-700 transition duration-300 ease-in-out"
                    onClick={onCloseButtonClick}
                  >
                    <Tooltip
                      content="Close"
                      placement="left"
                      style="dark"
                      className="text-xs transition duration-700 ease-in-out"
                    >
                      <svg
                        className="text-white text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </Tooltip>
                  </button>
                )
              }
              {
                (showProgrammerAi || showTNAi) && (
                  <>
                    <button
                    className="absolute right-2 -top-100 mb-10 w-10 h-10 rounded-full border-none bg-gray-700 hover:bg-gray-900 cursor-pointer transform hover:scale-110 hover:shadow-2xl hover:z-10 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 active:bg-gray-700 transition duration-300 ease-in-out"
                    onClick={onCloseButtonClick}
                  >
                    <Tooltip
                      content="Close"
                      placement="left"
                      style="dark"
                      className="text-xs transition duration-700 ease-in-out"
                    >
                      <svg
                        className="text-white text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </Tooltip>
                  </button>

                  <button
                    className="absolute right-2 -top-100 mt-20 w-10 h-10 rounded-full border-none bg-gray-700 hover:bg-gray-900 cursor-pointer transform hover:scale-110 hover:shadow-2xl hover:z-10 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 active:bg-gray-700 transition duration-300 ease-in-out"
                    onClick={() => {
                      setShowProgrammerAi(false)
                      setShowTNAi(false)
                    }
                    }
                  >
                    <Tooltip
                      content="Back"
                      placement="left"
                      style="dark"
                      className="text-xs transition duration-700 ease-in-out"
                    >
                      <svg
                        className="text-white text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </Tooltip>
                  </button>
                  </>
                )
              }
            </div>
      )}
    </>
  );
};

export default ChatWithAIButton;