import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'flowbite-react';
import Link from 'next/link';

export const CategoryDropdown = ({ 
    categories, 
    currentPath, 
    isScrolled,
    onItemHover,
    onItemLeave,
    hoveredItem
}) => {

    return (
        <Dropdown 
        label="Categories" 
        inline={true} 
        trigger="hover"
        className="transition duration-700 ease-in-out"
        >
        {categories.map((category) => (
            <Dropdown.Item 
            key={category.slug} 
            className='navbar-item w-52'
            >
            <Link
                href={`/category/${category.slug}`}
                onMouseLeave={onItemLeave}
                onMouseEnter={() => onItemHover(category.name)}
                className={`
                block w-full transition-colors duration-200
                ${currentPath === `/category/${category.slug}` 
                    ? 'text-violet-600 dark:text-violet-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400'}
                `}
            >
                {category.name}
                <span
                className={`
                    absolute bottom-0 left-0 h-0.5 bg-violet-600
                    transition-all duration-300 ease-out
                    ${hoveredItem === category.name ? 'w-full' : 'w-0'}
                `}
                />
            </Link>
            </Dropdown.Item>
        ))}
        </Dropdown>
    );
};

CategoryDropdown.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  currentPath: PropTypes.string.isRequired,
  isScrolled: PropTypes.bool.isRequired,
  onItemHover: PropTypes.func.isRequired,
  onItemLeave: PropTypes.func.isRequired,
  hoveredItem: PropTypes.string
};