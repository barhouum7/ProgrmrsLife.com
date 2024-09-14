import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Head from 'next/head'
import Link from 'next/link';
import { getPosts } from '../services/index';
import { motion } from 'framer-motion';
import { FaBook, FaLaptopCode, FaLightbulb, FaCalendarAlt, FaNewspaper, FaRobot } from 'react-icons/fa';

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

function Services() {
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            {servicesData.map((service, index) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </motion.div>

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
              <ServiceCard key={tool.title} {...tool} />
            ))}
          </motion.div>
        </div>
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

export default Services;

// Fetch data at build time
export async function getStaticProps() {
    const posts = (await getPosts()) || [];
    return {
      props: { posts },
    };
  }