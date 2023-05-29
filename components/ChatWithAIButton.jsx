import React, { useState, useRef, useEffect } from "react";
import { Tooltip } from "flowbite-react";

  /* Make resizable div */
  function makeResizableDiv(div) {
    const element = typeof window !== 'undefined' && window.document.querySelector(div);
    const resizers = typeof window !== 'undefined' && window.document.querySelectorAll(div + ' .resizer')
    const minimum_size = 20;
    let original_width = 0;
    let original_height = 0;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    for (let i = 0;i < resizers.length; i++) {
      const currentResizer = resizers[i];
      currentResizer.addEventListener('mousedown', function(e) {
        e.preventDefault()
        original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
        original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
        original_x = element.getBoundingClientRect().left;
        original_y = element.getBoundingClientRect().top;
        original_mouse_x = e.pageX;
        original_mouse_y = e.pageY;
        typeof window !== 'undefined' && window.addEventListener('mousemove', resize)
        typeof window !== 'undefined' && window.addEventListener('mouseup', stopResize)
      })
  
      function resize(e) {
        if (currentResizer.classList.contains('bottom-right')) {
          const width = original_width + (e.pageX - original_mouse_x);
          const height = original_height + (e.pageY - original_mouse_y)
          if (width > minimum_size) {
            element.style.width = width + 'px'
          }
          if (height > minimum_size) {
            element.style.height = height + 'px'
          }
        }
        else if (currentResizer.classList.contains('bottom-left')) {
          const height = original_height + (e.pageY - original_mouse_y)
          const width = original_width - (e.pageX - original_mouse_x)
          if (height > minimum_size) {
            element.style.height = height + 'px'
          }
          if (width > minimum_size) {
            element.style.width = width + 'px'
            element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
          }
        }
        else if (currentResizer.classList.contains('top-right')) {
          const width = original_width + (e.pageX - original_mouse_x)
          const height = original_height - (e.pageY - original_mouse_y)
          if (width > minimum_size) {
            element.style.width = width + 'px'
          }
          if (height > minimum_size) {
            element.style.height = height + 'px'
            element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
          }
        }
        else {
          const width = original_width - (e.pageX - original_mouse_x)
          const height = original_height - (e.pageY - original_mouse_y)
          if (width > minimum_size) {
            element.style.width = width + 'px'
            element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
          }
          if (height > minimum_size) {
            element.style.height = height + 'px'
            element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
          }
        }
      }
  
      function stopResize() {
        typeof window !== 'undefined' && window.removeEventListener('mousemove', resize)
        typeof window !== 'undefined' && window.removeEventListener('mouseup', stopResize)
      }
    }
  }

const ChatWithAIButton = () => {
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [showTNAi, setShowTNAi] = useState(false);
  const [showENAi, setShowENAi] = useState(false);
  const [showFRAi, setShowFRAi] = useState(false);
  const [showProgrammerAi, setShowProgrammerAi] = useState(false);
  const popupRef = useRef(null); // Reference to the popup window container
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleInitialChatState = () => {
      const hash = window.location.hash;
      if (hash === '#showENAi') {
        setShowChatWindow(true);
        setShowENAi(true);
      }
      if (hash === '#showTNAi') {
        setShowChatWindow(true);
        setShowTNAi(true);
      }
      if (hash === '#showFRAi') {
        setShowChatWindow(true);
        setShowFRAi(true);
      }
      if (hash === '#showProgrammerAi') {
        setShowChatWindow(true);
        setShowProgrammerAi(true);
      }
      if (hash === '#showChatWindow') {
        setShowChatWindow(true);
      }
    };

    handleInitialChatState();

    if (showChatWindow) {
      makeResizableDiv('.resizable');
    }
  }, [showChatWindow]);

  const onProgrammerAiButtonClick = () => {
    setShowProgrammerAi(true);
  };

  const onTNAiButtonClick = () => {
    setShowTNAi(true);
  };

  const onENAiButtonClick = () => {
    setShowENAi(true);
  };

  const onFRAiButtonClick = () => {
    setShowFRAi(true);
  };

  const onChatWithAIButtonClick = () => {
    setShowChatWindow(true);
  };

  const onCloseButtonClick = () => {
    setShowChatWindow(false);
    const hash = window.location.hash;
    if (hash === '#showENAi') {
      window.location.hash = '';
    }
    if (hash === '#showTNAi') {
      window.location.hash = '';
    }
    if (hash === '#showFRAi') {
      window.location.hash = '';
    }
    if (hash === '#showProgrammerAi') {
      window.location.hash = '';
    }
    if (hash === '#showChatWindow') {
      window.location.hash = '';
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keyup', (event) => {
      if (event.key === 'Escape') {
          setShowChatWindow(false);
          const hash = window.location.hash;
          if (hash === '#showENAi') {
            window.location.hash = '';
          }
          if (hash === '#showTNAi') {
            window.location.hash = '';
          }
          if (hash === '#showFRAi') {
            window.location.hash = '';
          }
          if (hash === '#showProgrammerAi') {
            window.location.hash = '';
          }
          if (hash === '#showChatWindow') {
            window.location.hash = '';
          }
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
        setShowENAi(false);
        setShowFRAi(false);
        const hash = window.location.hash;
        if (hash === '#showENAi') {
          window.location.hash = '';
        }
        if (hash === '#showTNAi') {
          window.location.hash = '';
        }
        if (hash === '#showFRAi') {
          window.location.hash = '';
        }
        if (hash === '#showProgrammerAi') {
          window.location.hash = '';
        }
        if (hash === '#showChatWindow') {
          window.location.hash = '';
        }
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
          <>
            <div 
            ref={popupRef}
            className="popup"
            // className={`
            //   ${isResizing ? 'popup resizable bg-transparent fixed bottom-5 right-5 z-30 flex flex-col justify-center items-center sm:max-w-7xl sm:w-full sm:mx-auto border-solid border-2 border-blue-600' : 'hidden'}
            // `}
              // style={{height: "90vh", maxHeight: "90vh"}}
              // style={{ width: `${windowWidth}px`, height: `${windowHeight}px` }}
            >
              <div 
                className="resizable fixed bottom-5 right-5 p-4 shadow-2xl z-40 flex flex-col justify-center items-center bg-gray-800 bg-opacity-95 sm:max-w-6xl sm:w-full sm:mx-auto sm:rounded-lg sm:p-8 pb-12 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl border-solid border-2 border-blue-600"
                style={{height: "90vh", maxHeight: "90vh"}}
                // style={{ width: `${windowWidth}px`, height: `${windowHeight}px` }}
              >
                {
                  !isResizing && (
                    <>
                      <div className='w-6/12 h-1 align-middle absolute -top-1 z-50 bg-sky-500 animate-[ping_1s_cubic-bezier(0,0,0.2,0)_infinite]'></div>
                      <div className='w-1 h-2/4 absolute -left-1 z-50 bg-sky-500 animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite]'></div>
                      <div className='w-1 h-2/4 absolute -right-1 z-50 bg-sky-500 animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite]'></div>
                      <div className='w-6/12 h-1 align-middle absolute -bottom-1 z-50 bg-sky-500 animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite]'></div>
                    </>
                  )
                }
              
              {/********* Tunisian's Dialect Ai bot code **********/}
              {!showTNAi && !showProgrammerAi && !showENAi && !showFRAi && (
              <button 
              className="rounded-full border-none bg-gray-700 hover:bg-gray-900 cursor-pointer transform hover:scale-110 hover:shadow-2xl hover:z-10 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 active:bg-gray-700 transition duration-300 ease-in-out
              mb-4 w-1/2 h-12 py-0 px-4 text-white text-xs lg:text-lg
              "
              onClick={onTNAiButtonClick}
              >
                  Tunisian's Dialect ChatGPT-4 Assistant 🇹🇳
              </button>
              )}
              {showTNAi && (
                <div
                  className="flex flex-col justify-center items-center"
                >
                  <span className="text-white sm:text-sm mb-2">
                    Ask me anything about Tunisia 🇹🇳
                  </span>
                    <div className="sm:max-w-6xl sm:w-full sm:mx-auto mr-2 shadow-inner shadow-[-60px_60px_600px_50px_rgba(0,10,9,0.3)] hover:shadow-[-60px_6px_500px_80px_rgba(80,10,100,0.3)]"
                      style={{height: "80vh", maxHeight: "90vh", 
                      width: "70vw", maxWidth: "80vw", minWidth: "30vw", minHeight: "30vh", resize: "both", overflow: "hidden"
                    }}
                    >
                    <iframe
                        title="Tunisian's Dialect ChatGPT-4 Assistant 🇹🇳"
                        src={`https://ora.ai/embed/e15e194c-088d-4413-92fe-642f8359cf51`}
                        style={{ border: "0", borderRadius: "4px", resize: "both", overflow: "hidden", width: "100%", height: "100%"}}
                    />
                  </div>
                </div>
              )}
              {/* ******* English Ai bot code ******** */}
              {!showENAi && !showTNAi && !showProgrammerAi && !showFRAi && (
              <button
                className="rounded-full border-none bg-gray-700 hover:bg-gray-900 cursor-pointer transform hover:scale-110 hover:shadow-2xl hover:z-10 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 active:bg-gray-700 transition duration-300 ease-in-out
                mb-4 w-1/2 h-12 py-0 px-4 text-white text-xs lg:text-lg
                "
                onClick={onENAiButtonClick}
              >
                English ChatGPT-4 Assistant 🇬🇧
              </button>
              )}
              {showENAi && (
                <div
                  className="flex flex-col justify-center items-center"
                >
                  <span className="text-white text-md mb-2">
                    Ask me anything about English 🇬🇧
                  </span>
                  <div className="sm:max-w-6xl sm:w-full sm:mx-auto mr-2 shadow-inner shadow-[-60px_60px_600px_50px_rgba(0,10,9,0.3)] hover:shadow-[-60px_6px_500px_80px_rgba(80,10,100,0.3)]"
                    style={{height: "80vh", maxHeight: "90vh",
                    width: "70vw", maxWidth: "80vw", minWidth: "30vw", minHeight: "30vh", resize: "both", overflow: "hidden"
                  }}
                  >
                    <iframe
                        title="English ChatGPT-4 Assistant 🇬🇧"
                        src={`https://ora.ai/embed/4b72d410-67b5-45f8-9799-4755a3cdc8bc`}
                        style={{ border: "0", borderRadius: "4px", resize: "both", overflow: "hidden", width: "100%", height: "100%"}}
                    />
                  </div>
                </div>
              )}
              {/* ******* French Ai bot code ******** */}
              {!showFRAi && !showTNAi && !showProgrammerAi && !showENAi && (
              <button
                className="rounded-full border-none bg-gray-700 hover:bg-gray-900 cursor-pointer transform hover:scale-110 hover:shadow-2xl hover:z-10 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 active:bg-gray-700 transition duration-300 ease-in-out
                mb-4 w-1/2 h-12 py-0 px-4 text-white text-xs lg:text-lg
                "
                onClick={onFRAiButtonClick}
              >
                French ChatGPT-4 Assistant 🇫🇷
              </button>
              )}
              {showFRAi && (
                <div
                  className="flex flex-col justify-center items-center"
                >
                  <span className="text-white text-md mb-2">
                    Ask me anything about French 🇫🇷
                  </span>
                  <div className="sm:max-w-6xl sm:w-full sm:mx-auto mr-2 shadow-inner shadow-[-60px_60px_600px_50px_rgba(0,10,9,0.3)] hover:shadow-[-60px_6px_500px_80px_rgba(80,10,100,0.3)]"
                    style={{height: "80vh", maxHeight: "90vh",
                    width: "70vw", maxWidth: "80vw", minWidth: "30vw", minHeight: "30vh", resize: "both", overflow: "hidden"
                  }}
                  >
                    <iframe
                        title="French ChatGPT-4 Assistant 🇫🇷"
                        src={`https://ora.ai/embed/56b61987-386d-4c37-9620-a71b2b506a3c`}
                        style={{ border: "0", borderRadius: "4px", resize: "both", overflow: "hidden", width: "100%", height: "100%"}}
                    />
                  </div>
                </div>
              )}

              {/* ******* Programmer AI BOT ******** */}
              {!showProgrammerAi && !showTNAi && !showENAi && !showFRAi && (
                <button 
                className="rounded-full border-none bg-gray-700 hover:bg-gray-900 cursor-pointer transform hover:scale-110 hover:shadow-2xl hover:z-10 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 active:bg-gray-700 transition duration-300 ease-in-out
                mb-4 w-1/2 h-12 py-0 px-4 text-white text-xs lg:text-lg
                "
                onClick={onProgrammerAiButtonClick}
              >
                Programmers Life ChatGPT-4 Assistant 👨‍💻
              </button>
              )}
              {showProgrammerAi && (
                <div
                  className="flex flex-col justify-center items-center"
                >
                  <span className="text-white text-md mb-2">
                  Ask me anything about Programmers Life 👨‍💻
                  </span>
                  <div className="sm:max-w-6xl sm:w-full sm:mx-auto mr-2 shadow-inner shadow-[-60px_60px_600px_50px_rgba(0,10,9,0.3)] hover:shadow-[-60px_6px_500px_80px_rgba(80,10,100,0.3)]"
                    style={{height: "80vh", maxHeight: "90vh", 
                      width: "70vw", maxWidth: "80vw", minWidth: "30vw", minHeight: "30vh", resize: "both", overflow: "hidden"
                    }}
                  >
                      <iframe
                          title="Programmers Life ChatGPT-4 Assistant 👨‍💻"
                          src={`https://ora.ai/embed/3dd613cd-73df-4abc-a254-bc4e0497c623`}
                          style={{ border: "0", borderRadius: "4px", resize: "both", overflow: "hidden", width: "100%", height: "100%"}}
                      />
                  </div>
                </div>
              )}
              {
                !showProgrammerAi && !showTNAi && !showENAi && !showFRAi && (
                  <button
                    className="absolute bottom-10 w-1/2 h-12 rounded-full shadow-inner shadow-sky-600 bg-gray-800 hover:bg-gray-900 cursor-pointer transform hover:scale-110 hover:shadow-2xl hover:z-10 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 active:bg-gray-700 transition duration-300 ease-in-out"
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
              
                  <div
                    className="resizer top-left absolute z-50 -top-2 -left-2 w-4 h-4 rounded-full bg-white border-solid border-2 border-blue-600 cursor-nwse-resize"
                    onMouseDown={() => setIsResizing(false)}
                  >
                      <div className='w-full h-full rounded-full align-middle absolute top-0 z-20 bg-sky-500 animate-ping'></div>
                  </div>
                  <div className='resizer top-right absolute z-50 -top-2 -right-2 w-4 h-4 rounded-full bg-white border-solid border-2 border-blue-600 cursor-nesw-resize'
                    onMouseDown={() => setIsResizing(false)}
                  >
                    <div className='w-full h-full rounded-full align-middle absolute top-0 z-20 bg-sky-500 animate-ping'></div>
                  </div>
                  <div className='resizer bottom-left absolute z-50 -bottom-2 -left-2 w-4 h-4 rounded-full bg-white border-solid border-2 border-blue-600 cursor-nesw-resize'
                    onMouseDown={() => setIsResizing(false)}
                  >
                    <div className='w-full h-full rounded-full align-middle absolute top-0 z-20 bg-sky-500 animate-ping'></div>
                  </div>
                  <div className='resizer bottom-right absolute z-50 -bottom-2 -right-2 w-4 h-4 rounded-full bg-white border-solid border-2 border-blue-600 cursor-nwse-resize'
                    onMouseDown={() => setIsResizing(false)}
                  >
                    <div className='w-full h-full rounded-full align-middle absolute top-0 z-20 bg-sky-500 animate-ping'></div>
                  </div>

              {
                (showProgrammerAi || showTNAi || showENAi || showFRAi) && (
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
                      setShowENAi(false)
                      setShowFRAi(false)
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
            </div>
          </>
      )}
    </>
  );
};

export default ChatWithAIButton;