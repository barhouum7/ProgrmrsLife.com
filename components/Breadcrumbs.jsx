import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const Breadcrumbs = ({ categories }) => (
  <nav aria-label="Breadcrumb" className="mb-4 flex justify-center">
    <ol className="flex flex-wrap items-center justify-center text-sm text-gray-500">
      <li className="mb-2 sm:mb-0">
        <Link href="/">
          <span className="hover:text-blue-600">Home</span>
        </Link>
      </li>
      {categories.map((category) => (
        <li key={category.slug} className="mb-2 sm:mb-0">
          <span className="mx-2">/</span>
          <Link href={`/category/${category.slug}`}>
            <span className="hover:text-blue-600">{category.name}</span>
          </Link>
        </li>
      ))}
    </ol>
  </nav>
);

Breadcrumbs.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  title: PropTypes.string.isRequired,
};

export default Breadcrumbs;