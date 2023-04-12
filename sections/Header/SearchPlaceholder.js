import React from 'react';

const SearchPlaceholder = ({isMac, isScrolled}) => {
    return (
        <>
            <span className={`font-medium text-xs text-gray-500 dark:text-gray-200
                ${isScrolled ? 'text-gray-800 dark:text-gray-400 font-semibold' : ''}
            `}>
                Press
                <kbd className="rounded bg-gray-300 dark:bg-gray-700 cursor-pointer px-1 ml-1 mr-1 text-xs font-bold border-gray-400 border-opacity-20 border-b-2 hover:border-none hover:shadow-inner hover:bg-gray-200 dark:hover:bg-gray-600 shadow-darker text-grey-600 dark:text-white">
                    {isMac ? "⌘" : "Ctrl"}
                </kbd>
                <span className='font-semibold'>
                    +
                </span>
                <kbd className="rounded bg-gray-300 dark:bg-gray-700 cursor-pointer px-1 ml-1 mr-1 text-xs font-bold border-gray-400 border-opacity-20 border-b-2 hover:border-none hover:shadow-inner hover:bg-gray-200 dark:hover:bg-gray-600 shadow-darker text-grey-600 dark:text-white">
                    <span>K</span>
                </kbd>
                to search
            </span>
        </>
    );
};

export default SearchPlaceholder;
