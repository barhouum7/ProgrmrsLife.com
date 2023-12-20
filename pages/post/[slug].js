import { useState, useEffect } from 'react';
import { useMyContext } from '../../contexts/MyContext';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
// import toast from 'react-hot-toast';
import { ToastContainer, toast } from 'react-toastify';
import {InlineReactionButtons} from 'sharethis-reactjs';

import { getPosts, getPostDetails } from "../../services"

import { PostDetail, Categories, PostWidget, Author, Comments, CommentsForm, Loader, AdsenseScript } from "../../components"
import { AdjacentPosts } from '../../sections';

const PostDetails = ({ post, error }) => {
    const router = useRouter();

    const [isCopied, setIsCopied] = useState(false);


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
            })
        }, 1000);
    }


    const copyToClipboard = () => {
        const link = `https://progrmrslife.com/post/${post.slug}`;
        navigator.clipboard.writeText(link)
            .then(() => {
            // show a success message or perform any other action on successful copy
            //alert Success
            toast.success('Link copied to clipboard!', {
                duration: 8000,
                position: 'top-center',
            })
                
            setIsCopied(true);
            })
            .catch((error) => {
            // show an error message or perform any other action on unsuccessful copy
                
            
                //alert Error
                toast.error('Failed to copy link, please copy the link from your browser.', {
                    duration: 20000,
                    position: 'top-center',
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


    const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
    const [showToast, setShowToast] = useState(false); // New state to control toast display

    // If welcome message shown once in this Home page, don't show it again in post details page
    const { isWelcomed, setIsWelcomed } = useMyContext();

    useEffect(() => {
        const isReturningUser = localStorage.getItem('returningUser') === 'true';

        if (isReturningUser) {
            setShowToast(true);
        } else {
            setShowWelcomeMessage(true);
        }
    }, []);

        useEffect(() => {
            if (!isWelcomed && showWelcomeMessage) {
                toast('👋Welcome to Programmers Life!', {
                    autoClose: 8000,
                    position: 'top-center',
                    className: 'dark:text-white dark:bg-gray-900',
                });
                setIsWelcomed(true);
            }

            if (!isWelcomed && showToast && !showWelcomeMessage) {
                toast('👋Welcome back! Thanks for visiting again!🤩', {
                    autoClose: 8000,
                    position: 'top-center',
                    className: 'dark:text-white dark:bg-gray-900',
                });
                setIsWelcomed(true);
            }

        }, [showWelcomeMessage, showToast]);

        const [postSlug, setPostSlug] = useState('');
        // ShareThis buttons
        useEffect(() => {
                if (window.__sharethis__ && postSlug !== '') {
                    // Add height to sticky share buttons
                    const stickyShareButton = document.querySelectorAll('.st-sticky-share-buttons .st-btn');
                    if (stickyShareButton) {
                        stickyShareButton.forEach((button) => {
                            button.style.height = '46px';
                        });
                    }
                }
        }, [postSlug]);

        useEffect(() => {
            // Update the post slug whenever the router's route changes (including query changes)
            setPostSlug(router.query.slug || '');
        }, [router.asPath]);
    
        
        useEffect(() => {
            // Add height to sticky share buttons
            const stickyShareButton = document.querySelectorAll('.st-sticky-share-buttons .st-btn');
            if (stickyShareButton) {
                stickyShareButton.forEach((button) => {
                    button.style.height = '46px';
                });
            }
        }, []);

        const [placeAdUnit, setPlaceAdUnit] = useState(false);
        useEffect(() => {
            setPlaceAdUnit(true);
        }, []);



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
                                <meta name="og:url" property="og:url" content={`https://progrmrslife.com/post/${post.slug}`} />
                                <meta name="twitter:card" content="summary_large_image" />
                                <meta name="twitter:title" content={post.title} />
                                <meta name="twitter:description" content={post.excerpt} />
                                <meta name="twitter:image" content={post.featuredImage.url} />
                                <meta name="twitter:creator" content="https://links.progrmrslife.com" />
                                <meta name="twitter:site" content="https://links.progrmrslife.com" />
                                <meta name="twitter:url" content={`https://progrmrslife.com/post/${post.slug}`} />
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
                                <meta name="twitter:data6" content={`https://twitter.com/intent/tweet?text=${post.title}&url=https://progrmrslife.com/post/${post.slug}`} />
                                <meta name="twitter:label7" content="Share on Facebook" />
                                <meta name="twitter:data7" content={`https://www.facebook.com/sharer/sharer.php?u=https://progrmrslife.com/post/${post.slug}`} />
                                <meta name="twitter:label8" content="Share on LinkedIn" />
                                <meta name="twitter:data8" content={`https://www.linkedin.com/shareArticle?mini=true&url=https://progrmrslife.com/post/${post.slug}&title=${post.title}&summary=${post.description}&source=https://progrmrslife.com/post/${post.slug}`} />
                                <meta name="facebook:card" content="summary_large_image" />
                                <meta name="facebook:title" content={post.title} />
                                <meta name="facebook:description" content={post.excerpt} />
                                <meta name="facebook:image" content={post.featuredImage.url} />
                                <meta name="facebook:creator" content="https://links.progrmrslife.com" />
                                <meta name="facebook:site" content="https://progrmrslife.com" />
                                <meta name="facebook:url" content={`https://progrmrslife.com/post/${post.slug}`} />
                                <meta name="facebook:label1" content="Written by" />
                                <meta name="facebook:data1" content={post.author.name} />
                                <meta name="facebook:label2" content="Filed under" />
                                <meta name="facebook:data2" content={post.categories.map((category) => category.name).join(', ')} />
                                <meta name="facebook:label3" content="Estimated reading time" />
                                <meta name="facebook:data3" content={`${getMinutesRead(post.content.text)} min read`} />
                                <meta name="facebook:label4" content="Published on" />
                                <meta name="facebook:data4" content={post.createdAt} />
                                <meta name="facebook:label5" content="Last updated on" />
                                <meta name="facebook:data5" content={post.updatedAt} />
                                <meta name="facebook:label6" content="Share on Twitter" />
                                <meta name="facebook:data6" content={`https://twitter.com/intent/tweet?text=${post.title}&url=https://progrmrslife.com/post/${post.slug}`} />
                                <meta name="facebook:label7" content="Share on Facebook" />
                                <meta name="facebook:data7" content={`https://www.facebook.com/sharer/sharer.php?u=https://progrmrslife.com/post/${post.slug}`} />
                                <meta name="facebook:label8" content="Share on LinkedIn" />
                                <meta name="facebook:data8" content={`https://www.linkedin.com/shareArticle?mini=true&url=https://progrmrslife.com/post/${post.slug}&title=${post.title}&summary=${post.description}&source=https://progrmrslife.com/post/${post.slug}`} />
                                <meta name="og:site_name" property="og:site_name" content="Programmers Life - Your Guide to Web Development, Tips & Tricks and Tech News" />
                                <meta name="og:type" property="og:type" content="article" />
                                <meta name="og:locale" property="og:locale" content="en_US" />                                
                                
                                <link rel="canonical" href={`https://progrmrslife.com/post/${post.slug}`} />
                                <link rel="alternate" type="application/rss+xml" title="Programmers Life RSS Feed" href="https://progrmrslife.com/rss.xml" />
                            </Head>
                            
                            <ToastContainer />

                            <AdsenseScript />
                            {/* <AWeberScript /> */}
                            <div className="dark:bg-gray-800 rounded-t-lg shadow-xl lg:p-4 mb-0 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl">
                                <div className="mb-8">
                                    {
                                        placeAdUnit && (
                                            // {/* <!-- Recommended-ad-unit --> */}
                                            <ins className="adsbygoogle"
                                            style={{ display: 'block' }}
                                            data-ad-client="ca-pub-1339539882255727"
                                            data-ad-slot="9618957531"
                                            data-ad-format="auto"
                                            data-full-width-responsive="true"></ins>
                                        )
                                    }
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                    <div className='lg:col-span-8 col-span-1'>
                                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl lg:p-8 pb-12 m-0 mb-8 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl">
                                            <PostDetail post={post} onCopyToClipboard={copyToClipboard} isCopied={isCopied} onEnablePopupMessage={enablePopupMessage} showToast={showToast} showWelcomeMessage={showWelcomeMessage} />
                                            {/* <!-- ShareThis Inline Reaction Buttons BEGIN --> */}
                                                {/* <p className='text-center'>
                                                <span className="hover:transition hover:duration-700 hover:ease-in-out text-lg font-thin text-white dark:text-gray-400 hover:underline bg-transparent hover:bg-gradient-to-r from-pink-500 to-transparent dark:hover:text-white">Let us know your reaction</span>
                                            </p> */}
                                            <div className='justify-center text-center'>
                                                <p>
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
                                                        static: false,        // hide react buttons and display static emoji (true, false)
                                                        url: `https://progrmrslife.com/post/${post.slug}`, // (defaults to current url)

                                                        // OPTIONAL PARAMETERS
                                                        hideWhenOffline: true,   // hide the react buttons when the browser goes offline (true, false)
                                                        onReactionButtonClick: function(e) {
                                                            console.log(e);
                                                        }, // fires when a user clicks one of the reaction buttons
                                                        preFetch: true,        // pre-fetch reaction images (true, false)
                                                        showReactionTotal: true // show the total number of reactions (true, false)
                                                    }}
                                                />
                                            </div>
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
