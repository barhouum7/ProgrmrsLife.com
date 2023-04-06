import React from 'react';

const SearchPlaceholder = ({isMac, isScrolled}) => {
    return (
        <>
            <span className={`font-medium text-xs text-gray-500 dark:text-gray-200
                ${isScrolled ? 'text-gray-800 dark:text-gray-400 font-semibold' : ''}
            `}>
                Press
                <kbd className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 rounded-md px-1.5 py-0.5 text-xs font-bold p-1 ml-1">
                    <span className="font-bold">{isMac ? "⌘" : "Ctrl"}</span>
                </kbd>
                <span className='font-semibold'>
                    +
                </span>
                <kbd className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 rounded-md px-1.5 py-0.5 text-xs font-medium p-1 mr-1">
                    <span className="font-bold">K</span>
                </kbd>
                to search
            </span>
        </>
    );
};

export default SearchPlaceholder;
