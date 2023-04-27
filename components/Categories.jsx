import React, {useState, useEffect} from 'react'
import Link from 'next/link'

import { getCategories } from '../services'

const Categories = () => {
    const [categories, setCategories] = useState([])
    useEffect(() => {
        getCategories()
            .then((newCategories) => setCategories(newCategories))
            .catch((err) => console.log(err))
    }, [])
  return (
    <div className='bg-white dark:bg-gray-800 rounded-t-lg rounded-b shadow-xl hover:shadow-indigo-500/40 p-8 mb-8 mt-5 transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-100 hover:shadow-2xl hover:z-10'>
        <h3 className='text-xl font-semibold border-b pb-4 mb-8'>
            Categories
        </h3>
        {categories.map((category) => (
            <Link href={`/category/${category.slug}`} key={category.slug}>
                <span className='border-b-effect block pb-3 mb-3 text-md font-semibold text-indigo-500 hover:text-pink-300 dark:text-gray-400 dark:hover:text-pink-300 cursor-pointer transition duration-700'>
                    {category.name}
                </span>
            </Link>
        ))}
        {
            categories.length === 0 && (
                <p className='text-gray-500 dark:text-gray-400 font-xs'>
                    Loading categories...
                </p>
            )
        }
    </div>
  )
}

export default Categories