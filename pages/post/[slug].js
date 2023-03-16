import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { getPosts, getPostDetails } from "../../services"

import { PostDetail, Categories, PostWidget, Author, Comments, CommentsForm } from "../../components"
import { AdjacentPosts } from '../../sections';

const PostDetails = ({ post }) => {
    const [isCopied, setIsCopied] = useState(false);


    const copyToClipboard = () => {
        const link = `https://programmerslife.site/post/${post.slug}`;
        navigator.clipboard.writeText(link)
            .then(() => {
            // show a success message or perform any other action on successful copy
            //alert Success
            toast.success('Link copied to clipboard!', {
                duration: 8000,
                position: 'top-center',
                // Styling
                style: {
                borderRadius: '10px',
                background: '#212A38',
                color: '#fff',
                },
            })
            

            // toast.promise(
            //     Promise.resolve(),
            //     {
            //         loading: 'Copying link...',
            //         success: <b>Link copied to clipboard!</b>,
            //         error: <b>Failed to copy link.</b>,
            //         style: {
            //             borderRadius: '10px',
            //             background: '#333',
            //             color: '#fff',
            //           },
            //     }
            //     );

            // console.log('Link copied to clipboard!');
                
            setIsCopied(true);
            })
            .catch((error) => {
            // show an error message or perform any other action on unsuccessful copy
                
            
                //alert Error
                toast.error('Failed to copy link, please copy the link from your browser.', {
                    duration: 20000,
                    position: 'top-center',
                    // Styling
                    style: {
                    background: '#212A38',
                    color: '#fff',
                    },
                })
                // console.error('Failed to copy link:', error.message);
            });
    };

    return (
        <>  
            <Toaster position="top-center" reverseOrder={false} />
            <div className="dark:bg-gray-800 rounded-t-lg shadow-xl lg:p-4 mb-0 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className='lg:col-span-8 col-span-1'>
                        <PostDetail post={post} onCopyToClipboard={copyToClipboard} isCopied={isCopied} />
                        <Author author={post.author} />
                        <AdjacentPosts slug={post.slug} createdAt={post.createdAt} />
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
        </>
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