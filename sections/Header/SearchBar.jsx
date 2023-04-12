import React, {useState, useEffect, useRef} from 'react'
// import NinjaKey from 'ninja-keys';
import { useKBar } from 'kbar'
import SearchPlaceholder from './SearchPlaceholder';

const SearchBar = ({isScrolled}) => {
    const searchInputRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const [isEscKey, setIsEscKey] = useState(false);
    const { query } = useKBar();
    const [isMac, setIsMac] = useState(false);

    useEffect(() => {
        setIsMac(navigator.userAgent.toLowerCase().indexOf('mac') !== -1);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'k') {
                setIsEscKey(true);
                document.getElementById('search-placeholder').style.display = 'none';
                // document.getElementById('search-navbar').placeholder = 'Press Esc to cancel';
            }
            });
        }
        if (typeof window !== 'undefined') {
            window.addEventListener('keyup', (event) => {
            if (event.key === 'Escape') {
                // document.getElementById('search-navbar').placeholder = 'Press Ctrl + K to search';
                setIsEscKey(false);
                document.getElementById('search-placeholder').style.display = 'block';
                setIsActive(false);
            }
            });
        }
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
            setIsActive(false);
            setIsEscKey(false);
            if (document.getElementById('esc-key')) {
                document.getElementById('esc-key').style.display = 'none';
            }
            document.getElementById('search-placeholder').style.display = 'block';
            } else if (searchInputRef.current && searchInputRef.current.contains(event.target)) {
            setIsActive(true);
            }
        }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
    }, [searchInputRef]);

return (
    <>
        <div className="flex md:order-2 pl-2">
            <button onClick={query.toggle} type="button" data-collapse-toggle="navbar-search" aria-controls="navbar-search" aria-expanded="false" className="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-1" >
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Search</span>
            </button>
            <button onClick={
                () => {
                    query.toggle();
                }
            }
            >
                <div className="relative hidden md:block">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className={`w-5 h-5 text-gray-500
                            ${isScrolled ? 'text-gray-800 dark:text-gray-400' : ''}
                        `} aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Search icon</span>
                    </div>
                    <span id='search-placeholder' className='absolute top-0 left-5 py-1 ml-4'>
                    {
                        !isActive ?
                            <SearchPlaceholder isScrolled={isScrolled} isMac={isMac} />
                        : (
                                
                                <span className={`text-gray-500 dark:text-gray-400 text-xs
                                    ${isScrolled ? 'text-gray-800 dark:text-gray-400 font-semibold' : ''}
                                `}>
                                    Press 
                                    <kbd className="rounded bg-gray-300 dark:bg-gray-700 cursor-pointer px-1 ml-1 mr-1 text-xs font-bold border-gray-400 border-opacity-20 border-b-2 hover:border-none hover:shadow-inner hover:bg-gray-200 dark:hover:bg-gray-600 shadow-darker text-grey-600 dark:text-white">
                                        <span className="font-bold">Esc</span>
                                    </kbd>
                                    to cancel
                                </span>
                        )
                    }
                    </span>
                    {
                        isEscKey && (
                            <span id='esc-key' className='absolute top-0 left-5 py-1 ml-4'>
                                <span className={`text-gray-500 dark:text-gray-400 text-xs
                                    ${isScrolled ? 'text-gray-800 dark:text-gray-400 font-semibold' : ''}
                                `}>
                                    Press 
                                    <kbd className="rounded bg-gray-300 dark:bg-gray-700 cursor-pointer px-1 ml-1 mr-1 text-xs font-bold border-gray-400 border-opacity-20 border-b-2 hover:border-none hover:shadow-inner hover:bg-gray-200 dark:hover:bg-gray-600 shadow-darker text-grey-600 dark:text-white">
                                        <span className="font-bold">Esc</span>
                                    </kbd>
                                    to cancel
                                </span>
                            </span>
                        )
                    }
                    <input type="text" ref={searchInputRef} id="search-navbar" className="block w-full p-2 pl-10 text-sm border border-none shadow-xl transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl rounded-lg bg-transparent focus:ring-blue-500 focus:border-blue-500 dark:bg-transparent dark:border-gray-600 placeholder-gray-400 text-gray-900 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder=""
                    />
                </div>
            </button>
        </div>
    </>
  )
}

export default SearchBar