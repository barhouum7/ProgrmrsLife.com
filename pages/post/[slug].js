import React from 'react'

import { getPosts, getPostDetails } from "../../services"

import { PostDetail, Categories, PostWidget, Author, Comments, CommentsForm } from "../../components"

const PostDetails = ({ post }) => {
    return (
        <div className="dark:bg-gray-800 rounded-lg shadow-xl lg:p-4 mb-0 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className='lg:col-span-8 col-span-1'>
                    <PostDetail post={post} />
                    <Author author={post.author} />
                    <CommentsForm slug={post.slug} />
                    <Comments slug={post.slug} />
                </div>

                <div className="lg:col-span-4 col-span-1">
                    <div className="lg:sticky relative top-0">
                        <PostWidget slug={post.slug} categories={post.categories.map((category) => category.slug)} />
                        <Categories />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostDetails

// Fetch data at build time
export async function getStaticProps({ params }) {
    const data = await getPostDetails(params.slug);
    return {
        props: {
            post: data
        }
    };
}

export async function getStaticPaths() {
    const posts = await getPosts();
    
    return {
        paths: posts.map(({ node: { slug } }) => ({
            params: {
                slug
            }
        })),
        fallback: false
    };
}