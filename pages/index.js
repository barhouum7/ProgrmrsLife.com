import React, {useState, useEffect} from "react";
import { PostCard, Categories, PostWidget, FeaturedPosts, Loader } from '../components'
import { getPosts } from '../services/index'

export default function Home ({ posts }) {
  const [isLoading, setIsLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    // Fetch posts from API
    getPosts()
      .then((data) => {
        // Update posts data and set loading state to false
        setBlogPosts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        // Handle error and set loading state to false
        console.error(error);
        setIsLoading(false);
      });
  }, []);
  

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

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = shuffledPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(shuffledPosts.length / postsPerPage);

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber);
  }

  return (
    <>
      <div>
        {/* Render loading state or post cards based on isLoading */}
        {isLoading ? (
          // <div>Loading...</div> // Replace with a spinner component or a loading message
          <Loader />
        ) : (
          <div>
            <FeaturedPosts />
            <div className='dark:bg-gray-800 container relative flex-grow rounded-t mx-auto p-4 transition ease-in-out duration-500'>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className='lg:col-span-8 col-span-1'>
                    {
                      currentPosts.map((post, index) => (
                        <PostCard key={index} post={post.node} />
                      ))
                    }
                    {
                    totalPages > 1 && (
                      <div className="flex flex-col items-center">
                          {/*  <!-- Help text --> */}
                          <span className="text-sm text-gray-200 dark:text-gray-400">
                              Showing <span className="font-extrabold text-white dark:text-white">1</span> to <span className="font-extrabold text-white dark:text-white">{currentPosts.length}</span> of <span className="font-extrabold text-white dark:text-white">{posts.length}</span> Entries
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
                          Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                            <button className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${pageNumber === currentPage ? 'font-extrabold bg-violet-700 px-2 shadow-xl' : 'rounded-l-full px-2'} ${pageNumber !== currentPage ? 'rounded-r-full px-2' : ''}`} key={pageNumber} onClick={() => handlePageChange(pageNumber)}>{pageNumber}</button>
                          ))
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

                    )
                  }
                  </div>

                <div className="lg:col-span-4 col-span-1 mr-4">
                  <div className="lg:sticky relative top-0">
                    <PostWidget />
                    <Categories />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </>
  );
}

// Fetch data at build time
export async function getStaticProps() {
  const posts = (await getPosts()) || [];
  return {
    props: { posts },
  };
}