import React, { useState, useEffect } from 'react';
import { postContentFont } from '../../config/fonts';
import { useMyContext } from '../../contexts/MyContext';
import { useRouter } from 'next/router';
import Head from 'next/head';
// import toast from 'react-hot-toast';
import { ToastContainer, toast } from 'react-toastify';
import {InlineReactionButtons} from 'sharethis-reactjs';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

import { getPosts, getPostDetails } from "../../services"

import { PostDetail, Categories, PostWidget, Author, Comments, CommentsForm, Loader, AdsenseScript } from "../../components"
import { AdjacentPosts } from '../../sections';

const PostDetails = ({ post, error }) => {
    const router = useRouter();
    const fullUrl = `https://progrmrslife.com${router.asPath}`;

    const [shouldReload, setShouldReload] = useState(false);

    useEffect(() => {
        const handleRouteChange = () => {
        // Check if the page is being navigated to for the first time
        if (!shouldReload) {
            // Set the state to trigger a reload
            setShouldReload(true);
        }
        };

        // Subscribe to router events for route changes
        router.events.on('routeChangeStart', handleRouteChange);

        // Clean up subscription on unmount
        return () => {
        router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [shouldReload, router.events]);

    const [currentSlug, setCurrentSlug] = useState('');

    useEffect(() => {
        // Get the current slug from the router
        const { slug } = router.query;
        if (slug !== currentSlug) {
            // If the slug has changed, update the currentSlug state
            setCurrentSlug(slug);
            if (shouldReload) {
                router.reload();
            }
        }
    }, [router.query.slug, currentSlug, shouldReload]);

    const [isLoading, setIsLoading] = useState(true);
    const [postDetails, setPostDetails] = useState([]);
    useEffect(() => {
        // router.prefetch('/post/[slug]'); // This will actually load the post page in the background, so it will be instantly available when the user navigates to it.
        if (post) {
            setPostDetails(post);
            setTimeout(() => {
                setIsLoading(false);
            }, 5000);
        }
    }, [post]);


    const [isCopied, setIsCopied] = useState(false);


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

        const fadeInUp = {
            initial: { opacity: 0, y: 60 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6 }
        };

        if (router.isFallback) { // While the page is generating, the user will see a loading state until getStaticProps() finishes and the page is served.
            return <Loader loading={isLoading} />;
        }

    return (
        <>
            <Head>
                <title>{`${post.title} — ${
                        // Get the current year from Date + one month (For example, if the current month is December, the year will be next year)
                        new Date().getFullYear() + (new Date().getMonth() === 11 ? 1 : 0) // If the current month is December, add 1 to the current year to get the next year
                } | Programmers Life`}</title>
                <meta name="description" content={post.excerpt} />
                <meta name="keywords" content={post.categories.map((category) => category.name).join(', ')} />
                <meta name="author" content={post.author.name} />
                
                {/* Open Graph */}
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:image" content={post.featuredImage.url} />
                <meta property="og:url" content={fullUrl} />
                <meta property="og:type" content="article" />
                <meta property="og:site_name" content="Programmers Life - Your Guide to Web Development, Tips & Tricks and Tech News" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.title} />
                <meta name="twitter:description" content={post.excerpt} />
                <meta name="twitter:image" content={post.featuredImage.url} />
                <meta name="twitter:creator" content="https://links.progrmrslife.com" />
                <meta name="twitter:site" content="https://links.progrmrslife.com" />

                {/* Other important meta tags */}
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="robots" content="index, follow" />
                <meta name="googlebot" content="index, follow" />
                <meta httpEquiv="Content-Language" content="en" />

                {/* App-specific meta tags */}
                <meta name="apple-mobile-web-app-title" content="ProgrammersLife" />
                <meta name="application-name" content="ProgrammersLife" />
                <meta name="msapplication-TileColor" content="#ffffff" />
                <meta name="msapplication-TileImage" content="/icons/icon-128x128.png" />

                {/* Article-specific meta tags */}
                <meta property="article:published_time" content={post.createdAt} />
                <meta property="article:modified_time" content={post.updatedAt} />
                <meta property="article:author" content={post.author.name} />
                <meta property="article:section" content={post.categories[0].name} />
                <meta property="article:tag" content={post.categories.map((category) => category.name).join(', ')} />

                <link rel="icon" href="/icons/favicon.svg" />
                <link rel="canonical" href={`https://progrmrslife.com/post/${post.slug}`} />
                <link rel="alternate" type="application/rss+xml" title="Programmers Life RSS Feed" href="https://progrmrslife.com/rss.xml" />
            </Head>
            <motion.div
                initial="initial"
                animate="animate"
                variants={{
                    initial: { opacity: 0 },
                    animate: { opacity: 1 }
                }}
                transition={{ duration: 0.5 }}
            >
                {
                    isLoading ? (
                        <Loader loading={isLoading} />
                    ) :
                    error ? (
                            <div className="text-center justify-center">
                                <h1 className="mb-4 tracking-tight font-extrabold text-4xl md:text-7xl text-red-400 dark:text-red-400">Whoops!</h1>
                                <p className="mb-4 text-2xl tracking-tight font-bold text-white md:text-3xl dark:text-white">There was an error loading this post content. Please try again later.</p>
                            </div>
                        ) : (
                            <>
                                <ToastContainer />

                                <div className="mb-8">
                                    {
                                        placeAdUnit && (
                                            <>
                                                {/* <!-- Recommended-ad-unit --> */}
                                                {/* <ins className="adsbygoogle"
                                                style={{ display: 'block' }}
                                                data-ad-client="ca-pub-1339539882255727"
                                                data-ad-slot="9618957531"
                                                data-ad-format="auto"
                                                data-full-width-responsive="true"></ins> */}

                                                {/* <!-- Recommended-ad-unit --> */}
                                                <ins className="adsbygoogle"
                                                style={{ display: 'block' }}
                                                data-ad-client="ca-pub-5021308603136043"
                                                data-ad-slot="3167248456"
                                                data-ad-format="auto"
                                                data-full-width-responsive="true"></ins>
                                            </>
                                        )
                                    }
                                </div>
                                <AdsenseScript />
                                {/* <AWeberScript /> */}
                                <motion.div className="rounded-t-lg shadow-xl lg:p-4 mb-0 hover:shadow-indigo-500/40 hover:shadow-2xl" variants={fadeInUp}>
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                        <motion.div className='lg:col-span-8 col-span-1' variants={fadeInUp}>
                                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl lg:p-8 pb-12 m-0 mb-8 hover:shadow-indigo-500/40 hover:shadow-2xl">
                                                <div className={`${postContentFont.className} text-base`}>
                                                    <PostDetail post={post} onCopyToClipboard={copyToClipboard} isCopied={isCopied} onEnablePopupMessage={enablePopupMessage} showToast={showToast} showWelcomeMessage={showWelcomeMessage} />
                                                </div>
                                                
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
                                            <div className="mb-8">
                                                {
                                                    placeAdUnit && (
                                                        <>
                                                            {/* <!-- Recommended-ad-unit --> */}
                                                            {/* <ins className="adsbygoogle"
                                                            style={{ display: 'block' }}
                                                            data-ad-client="ca-pub-1339539882255727"
                                                            data-ad-slot="9618957531"
                                                            data-ad-format="auto"
                                                            data-full-width-responsive="true"></ins> */}

                                                            {/* <!-- Recommended-ad-unit --> */}
                                                            <ins className="adsbygoogle"
                                                            style={{ display: 'block' }}
                                                            data-ad-client="ca-pub-5021308603136043"
                                                            data-ad-slot="3167248456"
                                                            data-ad-format="auto"
                                                            data-full-width-responsive="true"></ins>
                                                        </>
                                                    )
                                                }
                                            </div>
                                            
                                            <div id='authorBio'>
                                                <Author author={post.author} />
                                            </div>
                                            <div className="mb-8">
                                                {
                                                    placeAdUnit && (
                                                        <>
                                                            {/* <!-- Recommended-ad-unit --> */}
                                                            {/* <ins className="adsbygoogle"
                                                            style={{ display: 'block' }}
                                                            data-ad-client="ca-pub-1339539882255727"
                                                            data-ad-slot="9618957531"
                                                            data-ad-format="auto"
                                                            data-full-width-responsive="true"></ins> */}

                                                            {/* <!-- Recommended-ad-unit --> */}
                                                            <ins className="adsbygoogle"
                                                            style={{ display: 'block' }}
                                                            data-ad-client="ca-pub-5021308603136043"
                                                            data-ad-slot="3167248456"
                                                            data-ad-format="auto"
                                                            data-full-width-responsive="true"></ins>
                                                        </>
                                                    )
                                                }
                                            </div>
                                            <AdjacentPosts slug={post.slug} createdAt={post.createdAt} />
                                            <div className="mb-8">
                                                {
                                                    placeAdUnit && (
                                                        <>
                                                            {/* <!-- Recommended-ad-unit --> */}
                                                            {/* <ins className="adsbygoogle"
                                                            style={{ display: 'block' }}
                                                            data-ad-client="ca-pub-1339539882255727"
                                                            data-ad-slot="9618957531"
                                                            data-ad-format="auto"
                                                            data-full-width-responsive="true"></ins> */}

                                                            {/* <!-- Recommended-ad-unit --> */}
                                                            <ins className="adsbygoogle"
                                                            style={{ display: 'block' }}
                                                            data-ad-client="ca-pub-5021308603136043"
                                                            data-ad-slot="3167248456"
                                                            data-ad-format="auto"
                                                            data-full-width-responsive="true"></ins>
                                                        </>
                                                    )
                                                }
                                            </div>
                                            <div id='commentForm'>
                                                <CommentsForm slug={post.slug} postTitle={post.title} />
                                            </div>
                                            <div className="mb-8">
                                                {
                                                    placeAdUnit && (
                                                        <>
                                                            {/* <!-- Recommended-ad-unit --> */}
                                                            {/* <ins className="adsbygoogle"
                                                            style={{ display: 'block' }}
                                                            data-ad-client="ca-pub-1339539882255727"
                                                            data-ad-slot="9618957531"
                                                            data-ad-format="auto"
                                                            data-full-width-responsive="true"></ins> */}

                                                            {/* <!-- Recommended-ad-unit --> */}
                                                            <ins className="adsbygoogle"
                                                            style={{ display: 'block' }}
                                                            data-ad-client="ca-pub-5021308603136043"
                                                            data-ad-slot="3167248456"
                                                            data-ad-format="auto"
                                                            data-full-width-responsive="true"></ins>
                                                        </>
                                                    )
                                                }
                                            </div>
                                            <div id='allComments'>
                                                <Comments slug={post.slug} />
                                            </div>
                                            <div className="mb-8">
                                                {
                                                    placeAdUnit && (
                                                        <>
                                                            {/* <!-- Recommended-ad-unit --> */}
                                                            {/* <ins className="adsbygoogle"
                                                            style={{ display: 'block' }}
                                                            data-ad-client="ca-pub-1339539882255727"
                                                            data-ad-slot="9618957531"
                                                            data-ad-format="auto"
                                                            data-full-width-responsive="true"></ins> */}

                                                            {/* <!-- Recommended-ad-unit --> */}
                                                            <ins className="adsbygoogle"
                                                            style={{ display: 'block' }}
                                                            data-ad-client="ca-pub-5021308603136043"
                                                            data-ad-slot="3167248456"
                                                            data-ad-format="auto"
                                                            data-full-width-responsive="true"></ins>
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </motion.div>

                                        <motion.div className="lg:col-span-4 col-span-1" variants={fadeInUp}>
                                            <div className="lg:sticky relative top-0">
                                                <div className="mb-8">
                                                    {
                                                        placeAdUnit && (
                                                            <>
                                                                {/* // <!-- Vertical_Recommended_AdUnit --> */}
                                                                {/* <ins className="adsbygoogle"
                                                                style={{ display: 'block' }}
                                                                data-ad-client="ca-pub-1339539882255727"
                                                                data-ad-slot="9697463409"
                                                                data-ad-format="auto"
                                                                data-full-width-responsive="true"></ins> */}

                                                                {/* // <!-- Vertical_Recommended_AdUnit --> */}
                                                                <ins className="adsbygoogle"
                                                                style={{ display: 'block' }}
                                                                data-ad-client="ca-pub-5021308603136043"
                                                                data-ad-slot="3167248456"
                                                                data-ad-format="auto"
                                                                data-full-width-responsive="true"></ins>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                                <PostWidget slug={post.slug} categories={post.categories.map((category) => category.slug)} />
                                                <Categories />
                                                <div className="mb-8">
                                                    {
                                                        placeAdUnit && (
                                                            <>
                                                                {/* // <!-- Vertical_Recommended_AdUnit --> */}
                                                                {/* <ins className="adsbygoogle"
                                                                style={{ display: 'block' }}
                                                                data-ad-client="ca-pub-1339539882255727"
                                                                data-ad-slot="9697463409"
                                                                data-ad-format="auto"
                                                                data-full-width-responsive="true"></ins> */}

                                                                {/* // <!-- Vertical_Recommended_AdUnit --> */}
                                                                <ins className="adsbygoogle"
                                                                style={{ display: 'block' }}
                                                                data-ad-client="ca-pub-5021308603136043"
                                                                data-ad-slot="3167248456"
                                                                data-ad-format="auto"
                                                                data-full-width-responsive="true"></ins>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </>
                        )
                    }
            </motion.div>
        </>
    )
}

PostDetails.propTypes = {
    post: PropTypes.object,
    posts: PropTypes.array,
    error: PropTypes.bool
};

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
            },
            // Next.js will attempt to re-generate the page:
            // - When a request is made to the page
            // - At most once every 2 days (172800 seconds)
            revalidate: 172800, // 2 days
            // This is useful for pages that are not frequently updated
            // So if the page is not updated in 2 days, it will be re-generated
            // So what this does is it fetches the posts from the API and stores them in the props
            // For a blog, this is useful because the blog posts are not updated frequently
            // So if the blog posts are not updated in 2 days, the blog posts will be fetched again from the API and stored in the cache
            // And then Next.js will serve the page from the cache if the same page is requested again within 2 days
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
