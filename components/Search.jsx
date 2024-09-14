import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSearchResults } from '../services';
import { FaSearch } from 'react-icons/fa';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        setIsLoading(true);
        getSearchResults(searchTerm).then((results) => {
          setSearchResults(results);
          setIsLoading(false);
        });
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
<div className="relative w-full max-w-xl mx-auto">
    <div className={`relative flex items-center`}>
        <FaSearch className="absolute left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full py-3 pl-10 pr-4 text-gray-700 bg-white border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-500 transition-all duration-300 ${isFocused ? 'shadow-lg' : 'shadow'}`}
        />
        {isLoading && (
          <div className="absolute right-3 w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
        )}
      </div>
      {searchResults.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-xl overflow-hidden">
          {searchResults.map((post) => (
            <li key={post.slug} className="border-b last:border-b-0">
              <Link href={`/post/${post.slug}`}>
                <span className="block p-3 hover:bg-gray-100 transition-colors duration-200">
                  <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">{post.title}</h3>
                  {post.excerpt && (
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {searchTerm && searchResults.length === 0 && !isLoading && (
        <p className="absolute z-10 w-full mt-2 p-3 bg-white border rounded-lg shadow-xl text-gray-600">
          No results found for &quot;{searchTerm}&quot;
        </p>
      )}
    </div>
  );
};

export default Search;
