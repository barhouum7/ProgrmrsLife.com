import React from 'react'

const PostCard = ({post}) => {
  return (
    <div className="lg:col-span-4 mb-4">
        <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-600">{post.excerpt}</p>
        </div>
    </div>
  )
}

export default PostCard