import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Head from 'next/head'
import Link from 'next/link';
import { getPosts } from '../services/index';
import { motion } from 'framer-motion';
import { FaBook, FaLaptopCode, FaLightbulb, FaCalendarAlt, FaNewspaper, FaRobot } from 'react-icons/fa';
import { Loader } from '../components';

const ServiceCard = ({ title, description, icon: Icon, imgSrc, link }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl"
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative h-48">
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="object-cover transition-all duration-300 ease-in-out"
          style={{ filter: isHovered ? 'brightness(70%)' : 'brightness(100%)' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className={`text-4xl ${isHovered ? 'text-white' : 'text-transparent'} transition-all duration-300 ease-in-out`} />
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <Link href={link}>
          <span className="inline-block bg-pink-500 dark:bg-indigo-500 text-white font-bold py-2 px-4 rounded hover:bg-pink-600 dark:hover:bg-indigo-600 transition-colors duration-300 cursor-pointer">
            Learn More
          </span>
        </Link>
      </div>
    </motion.div>
  );
};

const Services = ({ posts, error }) => {
  const [placeAdUnit, setPlaceAdUnit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }

    // If there is an error fetching posts, set isLoading to false
    if (error) {
      setIsLoading(false);
    }
  }, [posts, error]);

  useEffect(() => {
    setPlaceAdUnit(true);
  }, []);

  const servicesData = [
    {
      title: 'Technical Guides and Tutorials',
      description: "In-depth technical guides and tutorials to help you master the latest technologies.",
      icon: FaBook,
      imgSrc: '/imgs/online-technical-guides-and-tutorials.jpg',
      link: '/category/tech-guides',
    },
    {
      title: 'Free Online Resources',
      description: 'A wide range of free online resources to improve your skills and stay up-to-date.',
      icon: FaLaptopCode,
      imgSrc: '/imgs/FreeOnlineResources.jpg',
      link: '/category/free-online-resources',
    },
    {
      title: 'Tips and Tricks',
      description: 'Optimize your workflows and streamline your development process with our expert tips.',
      icon: FaLightbulb,
      imgSrc: '/imgs/TipsandTricks.jpg',
      link: '/category/tips-and-tricks',
    },
    {
      title: 'Online Events',
      description: 'Webinars and workshops to help you learn from the best and connect with professionals.',
      icon: FaCalendarAlt,
      imgSrc: '/imgs/OnlineEvents.jpg',
      link: '/category/news-and-events',
    },
    {
      title: 'News',
      description: 'Stay up-to-date with the latest news and developments in the world of IT.',
      icon: FaNewspaper,
      imgSrc: '/imgs/News.jpg',
      link: '/category/news-and-events',
    },
  ];
  
  const tools = [
    {
      title: 'AskiboAI',
      description: "An AI-powered chatbot app built using OpenAI's GPT-3 API. Have a conversation with your AI friend!",
      icon: FaRobot,
      imgSrc: '/imgs/AskiboAi.gif',
      link: 'https://ask-chatgpt.progrmrslife.com',
    },
  ];
  
  return (
    <>
      <Head>
        <title>Programmers Life | Services</title>
      </Head>
      <div className='bg-gray-100 dark:bg-gray-800 min-h-screen py-12'>
        {isLoading ? (
          <Loader 
            loading={isLoading}
          />
        ) : error ? (
          <div className="text-center justify-center">
            <h1 className="mb-4 tracking-tight font-extrabold text-4xl md:text-7xl text-red-400 dark:text-red-400">Whoops!</h1>
            <p className="mb-4 text-2xl tracking-tight font-bold text-white md:text-3xl dark:text-white">There was an error loading the posts. Please try again later.</p>
          </div>
        ) : (
          <>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h1 className='text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4'>
                  Our Services
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Empowering developers with knowledge and tools
                </p>
              </motion.div>

              {placeAdUnit && (
                <>
                  {/* <!-- Recommended-ad-unit --> */}
                  <ins className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-5021308603136043"
                    data-ad-slot="3167248456"
                    data-ad-format="auto"
                    data-full-width-responsive="true">
                  </ins>
                </>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
              >
                {servicesData.map((service, index) => (
                  <React.Fragment key={service.title}>
                    <ServiceCard {...service} />
                    {(index + 1) % 3 === 0 && placeAdUnit && (
                      <>
                        {/* <!-- Recommended-ad-unit --> */}
                        <ins className="adsbygoogle"
                          style={{ display: 'block' }}
                          data-ad-client="ca-pub-5021308603136043"
                          data-ad-slot="3167248456"
                          data-ad-format="auto"
                          data-full-width-responsive="true">
                        </ins>
                      </>
                    )}
                  </React.Fragment>
                ))}
              </motion.div>

              {placeAdUnit && (
                <>
                  {/* <!-- Recommended-ad-unit --> */}
                  <ins className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-5021308603136043"
                    data-ad-slot="3167248456"
                    data-ad-format="auto"
                    data-full-width-responsive="true">
                  </ins>
                </>
              )}

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center mb-12"
              >
                <h2 className='text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4'>
                  Our Online Tools
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Cutting-edge tools to enhance your development experience
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {tools.map((tool, index) => (
                  <React.Fragment key={tool.title}>
                    <ServiceCard {...tool} />
                    {(index + 1) % 3 === 0 && placeAdUnit && (
                      <>
                        {/* <!-- Recommended-ad-unit --> */}
                        <ins className="adsbygoogle"
                          style={{ display: 'block' }}
                          data-ad-client="ca-pub-5021308603136043"
                          data-ad-slot="3167248456"
                          data-ad-format="auto"
                          data-full-width-responsive="true">
                        </ins>
                      </>
                    )}
                  </React.Fragment>
                ))}
              </motion.div>

              {placeAdUnit && (
                <>
                  {/* <!-- Recommended-ad-unit --> */}
                  <ins className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-5021308603136043"
                    data-ad-slot="3167248456"
                    data-ad-format="auto"
                    data-full-width-responsive="true">
                  </ins>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}

ServiceCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.func.isRequired,
    imgSrc: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
};

Services.propTypes = {
  posts: PropTypes.array,
  error: PropTypes.bool
};

export default Services;


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