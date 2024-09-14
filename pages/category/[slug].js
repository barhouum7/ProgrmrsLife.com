import React, {useState, useEffect} from "react";
import { FaEllipsisH } from 'react-icons/fa';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

import { getCategories, getCategoryPost, getCategory, getPosts } from '../../services';
import { PostCard, Categories, Loader, AdsenseScript } from '../../components';

const CategoryPost = ({ catPosts, categoryName, error }) => {

  const router = useRouter();

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
  const [categoryPosts, setCategoryPosts] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    if (catPosts) {
      setCategoryPosts(catPosts);
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }

  }, [catPosts]);
  

  // Shuffle the posts array to display them in a random order
  const [shuffledCatPosts, setShuffledCatPosts] = useState([]);

  useEffect(() => {
    // Shuffle the CatPosts array using Fisher-Yates shuffle algorithm
    let array = [...catPosts]; // Copy the array to avoid mutating the original array after shuffle is applied to the array itself
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i - 1 in the array
      [array[i], array[j]] = [array[j], array[i]]; // Array destructuring assignment for performance reasons (see https://github.com/airbnb/javascript#destructuring--assignment)
    }
    setShuffledCatPosts(array); // Update the state with the shuffled array of posts that will be displayed on the page
  }, [catPosts]); // Re-run this effect when the posts array changes (e.g. when the posts are fetched from the API) to shuffle the posts again


  // Pagination
  // Update the state with the current page number
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = shuffledCatPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(shuffledCatPosts.length / postsPerPage);

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
        className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white ${
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
      setPlaceAdUnit(true);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  if (router.isFallback) {
    return <Loader loading={isLoading} />;
  }

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
            <Head>
              <title>{`${categoryName} | Programmers Life`}</title>
              <meta name="description" content={
                `Programmers Life is a blog for programmers. We write about programming, web development, and software development.`
              } />
              <meta name="keywords" content="programming, web development, software development, programming blog, web development blog, software development blog" />
              <meta name="author" content="Programmers Life" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <meta name="robots" content="index, follow" />
              <meta name="googlebot" content="index, follow" />
              <meta name="google" content="nositelinkssearchbox" />
              <meta name="google" content="notranslate" />
              <meta name="google" content="notranslate" />
              <meta httpEquiv="Content-Language" content="en" />
              <meta name="language" content="English" />
              <meta property="og:title" content={`${categoryName} | Programmers Life`} />
              <meta property="og:description" content={
                `Programmers Life is a blog for programmers. We write about programming, web development, and software development.`
              } />
              <meta property="og:type" content="website" />
              <meta property="og:url" content="https://progrmrslife.com" />
              <meta property="og:site_name" content="Programmers Life - Your Guide to Web Development, Tips & Tricks and Tech News" />
              <link rel="icon" href="/imgs/favicon.svg" />
              <link rel="canonical" href="https://progrmrslife.com" />
              <link rel="alternate" href="https://progrmrslife.com" hrefLang="en" />
              <link rel="alternate" href="https://progrmrslife.com" hrefLang="x-default" />
              <link rel="alternate" href="https://progrmrslife.com" hrefLang="en-US" />
            </Head>
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
                <motion.div className="col-span-1 lg:col-span-12 text-center" variants={fadeInUp}>
                  <h1 className="lg:text-4xl text-2xl text-pink-500 dark:text-indigo-400 leading-8 font-extrabold tracking-wide uppercase my-4">
                    {categoryName}
                  </h1>
                </motion.div>
                <motion.div className="col-span-1 lg:col-span-8" variants={fadeInUp}>
                  {currentPosts.map((post, index) => (
                    <motion.div key={index} variants={fadeInUp}>
                      <PostCard post={post.node} />
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
                  ))}
                  
                  {/*  <!-- Pagination --> */}
                  
                  {
                    totalPages > 1 ? (
                      <div className="flex flex-col items-center">
                          {/*  <!-- Help text --> */}
                          <span className="text-sm text-gray-900 dark:text-gray-400">
                              Showing <span className="font-extrabold text-gray-900 dark:text-white">1</span> to <span className="font-extrabold text-gray-900 dark:text-white">{currentPosts.length}</span> of <span className="font-extrabold text-gray-900 dark:text-white">{catPosts.length}</span> Entries
                          </span>
                        <div className="inline-flex justify-center items-center space-x-4 mt-4 xs:mt-0">
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
                          
                          {
                            pageButtons
                          }

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

                    ) : totalPages === 0 && catPosts.length === 0 ? (
                        <div className="text-center justify-center">
                            <h1 className="mb-4 mt-8 tracking-tight font-extrabold text-2xl md:text-4xl text-red-400 dark:text-red-400">Whoops!</h1>
                            <p className="text-xl tracking-tight font-bold text-gray-900 md:text-xl dark:text-white">There are no posts in this category yet.</p>
                        </div>
                    ) : totalPages === 1 && currentPage !== 1 ? (
                      typeof window !== 'undefined' && window.location.reload()
                    ) : null
                  }
                </motion.div>
                <motion.div className="col-span-1 lg:col-span-4" variants={fadeInUp}>
                  <div className="relative lg:sticky top-8">
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
                    <Categories />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )
      }
    </motion.div>
  );
};

CategoryPost.propTypes = {
  catPosts: PropTypes.array,
  categoryName: PropTypes.string,
  error: PropTypes.bool
};

export default CategoryPost;

// Fetch data at build time
export async function getStaticProps({ params }) {
  const { slug } = params;
  const catPosts = await getCategoryPost(slug);
  const categoryName = await getCategory(slug);
  const posts = (await getPosts()) || [];

  try {
    return {
      props: {
        catPosts,
        categoryName,
        posts, // Passing this prop to be able to load posts from the Kbar Quick Search
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
      },
    };
  }

}


// Specify dynamic routes to pre-render pages based on data.
// The HTML is generated at build time and will be reused on each request.
export async function getStaticPaths() {
  const categories = await getCategories();
  return {
    paths: categories.map(({
        slug
    }) => ({
      params: {
        slug,
      },
    })),
    fallback: true,
  };
}