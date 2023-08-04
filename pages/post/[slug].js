import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import toast, { Toaster } from 'react-hot-toast';
import {InlineReactionButtons} from 'sharethis-reactjs';

import { getPosts, getPostDetails } from "../../services"

import { PostDetail, Categories, PostWidget, Author, Comments, CommentsForm, Loader, AWeberScript, AdsenseScript } from "../../components"
import { AdjacentPosts } from '../../sections';

const PostDetails = ({ post, error }) => {

    useEffect(() => {
        const stickyShareButtons = document.querySelector('.st-sticky-share-buttons');
        if (stickyShareButtons) {
            stickyShareButtons.classList.remove('st-hidden');
        }

        const stickyShareButton = document.querySelectorAll('.st-sticky-share-buttons .st-btn');
        if (stickyShareButton) {
            stickyShareButton.forEach((button) => {
                button.style.height = '46px';
            });
        }

        const inlineReactionButtons = document.querySelector('.st-inline-reaction-buttons');
        if (inlineReactionButtons) {
            inlineReactionButtons.classList.remove('st-hidden');
        }
    }, []);

    const [isCopied, setIsCopied] = useState(false);


    const router = useRouter();

    if (router.isFallback) {
        return <Loader />
    }

    const enablePopupMessage = () => {
        // console.log('Please allow popups for this website to share this article.');
        //alert Error
        alert('⚠ Please allow popups for this website to share this article.🔐☝');
        setTimeout(() => {
            toast.error('⚠ Please allow popups for this website to share this article.🔐☝', {
                duration: 30000,
                position: 'top-left',
                // Styling
                style: {
                background: '#212A38',
                color: '#fff',
                },
            })
        }, 1000);
    }


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
    const getMinutesRead = (text) => {
        const words = text.split(' ').length;
        const wordsPerMinute = 60;
        const minutes = Math.round(words / wordsPerMinute);
        return minutes;
    }

    return (
        <>
            {
                error ? (
                        <div className="text-center justify-center">
                            <h1 className="mb-4 tracking-tight font-extrabold text-4xl md:text-7xl text-red-400 dark:text-red-400">Whoops!</h1>
                            <p className="mb-4 text-2xl tracking-tight font-bold text-white md:text-3xl dark:text-white">There was an error loading this post content. Please try again later.</p>
                        </div>
                    ) : (
                        <>
                            <Head>
                                <title>{`${post.title} | Programmers Life`}</title>
                                <meta name="description" content={post.excerpt} />
                                <link rel="icon" href="/imgs/favicon.svg" />
                                <meta name="keywords" content={post.categories.map((category) => category.name).join(', ')} />
                                <meta name="author" content={post.author.name} />
                                <meta name="og:title" property="og:title" content={post.title} />
                                <meta name="og:description" property="og:description" content={post.excerpt} />
                                <meta name="og:image" property="og:image" content={post.featuredImage.url} />
                                <meta name="og:url" property="og:url" content={`https://programmerslife.site/post/${post.slug}`} />
                                <meta name="twitter:card" content="summary_large_image" />
                                <meta name="twitter:title" content={post.title} />
                                <meta name="twitter:description" content={post.excerpt} />
                                <meta name="twitter:image" content={post.featuredImage.url} />
                                <meta name="twitter:creator" content="https://link.programmerslife.site" />
                                <meta name="twitter:site" content="https://link.programmerslife.site" />
                                <meta name="twitter:url" content={`https://programmerslife.site/post/${post.slug}`} />
                                <meta name="twitter:label1" content="Written by" />
                                <meta name="twitter:data1" content={post.author.name} />
                                <meta name="twitter:label2" content="Filed under" />
                                <meta name="twitter:data2" content={post.categories.map((category) => category.name).join(', ')} />
                                <meta name="twitter:label3" content="Estimated reading time" />
                                <meta name="twitter:data3" content={`${getMinutesRead(post.content.text)} min read`} />
                                <meta name="twitter:label4" content="Published on" />
                                <meta name="twitter:data4" content={post.createdAt} />
                                <meta name="twitter:label5" content="Last updated on" />
                                <meta name="twitter:data5" content={post.updatedAt} />
                                <meta name="twitter:label6" content="Share on Twitter" />
                                <meta name="twitter:data6" content={`https://twitter.com/intent/tweet?text=${post.title}&url=https://programmerslife.site/post/${post.slug}`} />
                                <meta name="twitter:label7" content="Share on Facebook" />
                                <meta name="twitter:data7" content={`https://www.facebook.com/sharer/sharer.php?u=https://programmerslife.site/post/${post.slug}`} />
                                <meta name="twitter:label8" content="Share on LinkedIn" />
                                <meta name="twitter:data8" content={`https://www.linkedin.com/shareArticle?mini=true&url=https://programmerslife.site/post/${post.slug}&title=${post.title}&summary=${post.description}&source=https://programmerslife.site/post/${post.slug}`} />
                                
                                <link rel="canonical" href={`https://programmerslife.site/post/${post.slug}`} />
                                {/* <link rel="alternate" type="application/rss+xml" title="Programmers Life" href="https://programmerslife.site/rss.xml" />
                                <link rel="alternate" type="application/atom+xml" title="Programmers Life" href="https://programmerslife.site/atom.xml" />
                                <link rel="alternate" type="application/json" title="Programmers Life" href="https://programmerslife.site/feed.json" />
                                <link rel="alternate" type="application/json" title="Programmers Life" href="https://programmerslife.site/feed.json" /> */}
                            </Head>
                            {/* <!-- Google tag (gtag.js) --> */}
                            <Script 
                                async 
                                src="https://www.googletagmanager.com/gtag/js?id=G-PEF01PTY1T"
                            />
                            <Script>
                                {`
                                    window.dataLayer = window.dataLayer || [];
                                    function gtag(){dataLayer.push(arguments);}
                                    gtag('js', new Date());
                                    gtag('config', 'G-PEF01PTY1T');
                                `}
                            </Script>


                            {/* <!-- Recommended-ad-unit --> */}
                            <ins className="adsbygoogle"
                                    style={{ display: 'block' }}
                                    data-ad-client="ca-pub-1339539882255727"
                                    data-ad-slot="9618957531"
                                    data-ad-format="auto"
                                    data-full-width-responsive="true"></ins>
                            <AdsenseScript />
                            <AWeberScript />
                            <Toaster position="top-center" reverseOrder={false} />
                            <div className="dark:bg-gray-800 rounded-t-lg shadow-xl lg:p-4 mb-0 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                    <div className='lg:col-span-8 col-span-1'>
                                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl lg:p-8 pb-12 m-0 mb-8 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl">
                                            <PostDetail post={post} onCopyToClipboard={copyToClipboard} isCopied={isCopied} onEnablePopupMessage={enablePopupMessage} />
                                            {/* <!-- ShareThis Inline Reaction Buttons BEGIN --> */}
                                                {/* <p className='text-center'>
                                                <span className="hover:transition hover:duration-700 hover:ease-in-out text-lg font-thin text-white dark:text-gray-400 hover:underline bg-transparent hover:bg-gradient-to-r from-pink-500 to-transparent dark:hover:text-white">Let us know your reaction</span>
                                            </p> */}
                                            <p className='text-center'>
                                                <span className="hover:transition hover:duration-700 hover:ease-in-out text-lg font-thin text-gray-600 dark:text-gray-400 hover:underline bg-transparent hover:bg-gradient-to-r from-pink-500 to-transparent hover:text-gray-900 dark:hover:text-white">Let us know your reaction</span>
                                            </p>
                                            <InlineReactionButtons
                                            config={{
                                                alignment: 'center',  // alignment of buttons (left, center, right)
                                                enabled: true,        // show/hide buttons (true, false)
                                                language: 'en',       // which language to use (see LANGUAGES)
                                                min_count: 0,         // hide react counts less than min_count (INTEGER)
                                                padding: 12,          // padding within buttons (INTEGER)
                                                reactions: [          // which reactions to include (see REACTIONS)
                                                'slight_smile',
                                                'heart_eyes',
                                                'laughing',
                                                'astonished',
                                                'sob',
                                                'rage'
                                                ],
                                                size: 48,             // the size of each button (INTEGER)
                                                spacing: 8,           // the spacing between buttons (INTEGER)
                                            }}
                                            />
                                            {/* <!-- ShareThis END --> */}
                                        </div>
                                        
                                        <div id='authorBio'>
                                            <Author author={post.author} />
                                        </div>
                                        <AdjacentPosts slug={post.slug} createdAt={post.createdAt} />
                                        <div id='commentForm'>
                                            <CommentsForm slug={post.slug} postTitle={post.title} />
                                        </div>
                                        <div id='allComments'>
                                            <Comments slug={post.slug} />
                                        </div>
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
        </>
    )
}

export default PostDetails

// Fetch data at build time
export async function getStaticProps({ params }) {
    const data = await getPostDetails(params.slug);
    const posts = (await getPosts()) || [];
    try {
        return {
            props: {
                post: data,
                posts,
            }
        };
    } catch (error) {
        return {
            props: {
                error: true,
            }
        };
    }
}

// Specify dynamic routes to pre-render based on data source and post data source properties
export async function getStaticPaths() {
    const posts = await getPosts();

    try {
    const paths = posts.map(({ node: { slug } }) => ({
        params: {
            slug,
        },
    }));

    return {
        paths,
        fallback: true,
    };
    } catch (error) {
    console.error("Error fetching posts:", error);
    return {
        props: {
            error: true,
        },
    };
    }
}
