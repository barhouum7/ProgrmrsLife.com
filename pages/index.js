import React, {useState, useEffect} from "react";
import { useRouter } from "next/router";
import { useMyContext } from "../contexts/MyContext";
import { FaEllipsisH } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { PostCard, Categories, PostWidget, FeaturedPosts, Loader, AdsenseScript} from '../components'
import { getPosts } from '../services/index'
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import Head from "next/head";

export default function Home ({ posts, error }) {
    const router = useRouter();
    // Check if returning visitor or not handle...
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
    const [showToast, setShowToast] = useState(false); // New state to control toast display
    
    const { isWelcomed , setIsWelcomed } = useMyContext();

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

      }, [showWelcomeMessage, showToast, isWelcomed, setIsWelcomed]);


  // Fetch posts from API and store in state using React Hooks (useState)
  const [isLoading, setIsLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState([]);
  useEffect(() => {
    // If the document is still loading, set isLoading to true
    if (document.readyState === "loading") {
      setIsLoading(true);
    }

    // If the document has finished loading, set isLoading to false
    if (document.readyState === "complete") {
      setIsLoading(false);
    }
    
    // If posts are not available, set isLoading to true
    if (!posts) {
      setIsLoading(true);
    }

    // If posts are available, set isLoading to false
    if (posts) {
      setBlogPosts(posts);
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }

    // If there is an error fetching posts, set isLoading to false
    if (error) {
      setIsLoading(false);
    }
  }
  , [posts]);
  
  // useEffect(() => {
  //   setIsLoading(true);
  //   // Fetch posts from API
  //   getPosts()
  //     .then((data) => {
  //       // Update posts data and set loading state to false
  //       setBlogPosts(data);
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       // Handle error and set loading state to false
  //       console.error(error);
  //       setIsLoading(false);
  //     });
  // }, []);
  

  const [shuffledPosts, setShuffledPosts] = useState([]);

  useEffect(() => {
    // Shuffle the posts array using Fisher-Yates shuffle algorithm
    let array = [...posts];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    setShuffledPosts(array);
  }, [posts]);

  // Pagination
  // Update the state with the current page number
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = shuffledPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(shuffledPosts.length / postsPerPage);

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber);
  }


// To display a limited number of page buttons and represent the remaining pages with an ellipsis icon

const MAX_VISIBLE_PAGES = 3; // Maximum number of visible page buttons

// Calculate the range of page numbers to display
const startPage = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
const endPage = Math.min(startPage + MAX_VISIBLE_PAGES - 1, totalPages);

// Generate the page buttons
const pageButtons = [];

for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
  pageButtons.push(
    <button
      className={`inline-flex items-center mr-1 px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white ${
      pageNumber === currentPage ? "font-extrabold text-white bg-violet-700 dark:bg-opacity-20 px-2 shadow-xl shadow-gray-700 dark:shadow-gray-900" : "rounded-l-full px-2"
      } ${pageNumber !== currentPage ? "rounded-r-full px-2" : ""}`}
      key={pageNumber}
      onClick={() => handlePageChange(pageNumber)}
    >
      {pageNumber}
    </button>
  );
}

// Add ellipsis icon if there are more pages
if (totalPages > MAX_VISIBLE_PAGES) {
  if (startPage > 1) {
    pageButtons.unshift(
      <span className="inline-flex items-center px-2 py-2 text-sm text-gray-500 dark:text-white" key="ellipsis-start">
        <FaEllipsisH size={16} />
      </span>
    );
  }
  if (endPage < totalPages) {
    pageButtons.push(
      <span className="inline-flex items-center px-2 py-2 text-sm text-gray-500 dark:text-white" key="ellipsis-end">
        <FaEllipsisH size={16} />
      </span>
    );
  }
}


  const [placeAdUnit, setPlaceAdUnit] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setPlaceAdUnit(true);
    }, 2000); // 2 seconds delay
  
    return () => clearTimeout(timer);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1 }
      }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <Head>
          <title>ProgrmrsLife - Web Dev, Tech Tips & News</title>
          <meta name="description" content="Explore programming, web development, and tech insights with ProgrmrsLife. Get the latest tips, tutorials, and news in the tech world." />
          <meta name="keywords" content="programming, web development, technology, coding tutorials, software engineering, latest tech trends, frameworks, libraries, tech news" />
          <meta name="author" content="ProgrmrsLife" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta property="og:title" content="ProgrmrsLife - Your Hub for Programming Insights" />
          <meta property="og:description" content="Explore the latest in programming, tech, and web development with expert insights and tutorials." />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://www.progrmrslife.com/icons/icon-512x512.png" />
          <meta property="og:url" content={`https://www.progrmrslife.com${router.asPath}`} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="ProgrmrsLife - Web Dev, Tech Tips & News" />
          <meta name="twitter:description" content="Explore the latest in programming, tech, and web development with expert insights and tutorials." />
          <meta name="twitter:image" content="https://www.progrmrslife.com/icons/icon-512x512.png" />
          <meta name="twitter:url" content={`https://www.progrmrslife.com${router.asPath}`} />
          <link rel="icon" href="/icons/favicon.svg" />
          <link rel="apple-touch-icon" href="/icons/icon-128x128.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
          <meta name="theme-color" content="#60A5FA" />
        </Head>
        <ToastContainer />
        {/* Render loading state or post cards based on isLoading */}
        {isLoading ? (
          // <div>Loading...</div> // Replace with a spinner component or a loading message
          <Loader 
            loading={isLoading}
          />

        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <h1 className="mb-4 tracking-tight font-extrabold text-4xl md:text-7xl text-red-400 dark:text-red-400">Whoops!</h1>
              <p className="mb-4 text-2xl tracking-tight font-bold text-gray-800 md:text-3xl dark:text-white">There was an error loading this page.</p>
              <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg transition-colors"
              >
                  Try Again
              </button>
          </div>
        ) : (
            <div>

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
              <div className="p-4">
                <FeaturedPosts />
              </div>
              
              <div className="my-8">
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

              <motion.div className='relative rounded-t p-4' variants={fadeInUp}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className='lg:col-span-8 col-span-1'>
                      {
                        currentPosts.map((post, index) => (
                          <motion.div key={index} variants={fadeInUp}>
                            <PostCard post={post.node} />
                            <div className="my-8">
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
                        ))
                      }
                      {
                      totalPages > 1 && (
                        <div className="flex flex-col items-center">
                            {/*  <!-- Help text --> */}
                            <span className="text-sm text-gray-900 dark:text-gray-400">
                                Showing <span className="font-extrabold text-gray-900 dark:text-white">1</span> to <span className="font-extrabold text-gray-900 dark:text-white">{currentPosts.length}</span> of <span className="font-extrabold text-gray-900 dark:text-white">{posts.length}</span> Entries
                            </span>
                            
                            <div className="flex-col sm:flex-row sm:inline-flex justify-center items-center space-y-4 sm:space-y-0 space-x-1 sm:space-x-4 mt-4 xs:mt-0">
                              {/*  <!-- Pagination --> */}
                              {currentPage > 1 && (
                                <button
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                onClick={() => handlePageChange(currentPage - 1)}
                                aria-label="Previous Page"
                              >
                                <svg aria-hidden="true" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                                </svg>
                                Previous
                              </button>
                              )}
                              
                              <div className="sm:inline-flex block">
                                {pageButtons}
                              </div>
    
                              {currentPage < totalPages && (
                                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" 
                                onClick={() => handlePageChange(currentPage + 1)}
                                aria-label="Next Page"
                                >
                                  Next
                                  <svg aria-hidden="true" className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button>
                              )}
                            </div>
                        </div>
  
                      )
                    }
                    </div>
  
                  <motion.div className="lg:col-span-4 col-span-1 mr-4" variants={fadeInUp}>
                    <div className="lg:sticky relative top-0">
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
                      <PostWidget />
                      <div className="my-8">
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
                      <Categories />
                      <div className="my-8">
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
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          )
        }
      </div>
      </motion.div>
  );
}

Home.propTypes = {
  posts: PropTypes.array,
  error: PropTypes.bool
};

// Fetch data at build time
export async function getStaticProps() {
  try {
    const posts = await getPosts();
    return {
      props: { posts },
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
    console.error("Error fetching posts:", error);
    return {
      props: { posts: [], error: true },
    };
  }
}