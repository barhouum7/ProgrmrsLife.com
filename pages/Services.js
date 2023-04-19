import React, { useState } from 'react';
import Image from 'next/image';
import Head from 'next/head'
import Link from 'next/link';
import { getPosts } from '../services/index';

const Card = ({ title, description, imgSrc }) => {
    const [hover, setHover] = useState(false);

    const handleMouseEnter = () => setHover(true);
    const handleMouseLeave = () => setHover(false);

    return (
        <div
            className="relative group h-64 rounded-lg overflow-hidden shadow-lg hover:z-50 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:z-50 cursor-pointer mb-4"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Image
            src={imgSrc}
            alt={title}
            fill
            sizes='(max-width: 640px) 100vw, 640px'
            priority
            className="object-cover transform transition-all duration-500 ease-in-out"
            style={{ filter: hover ? 'brightness(70%)' : 'brightness(100%)' }}
            />
            <div
            className="absolute inset-0 bg-gray-900 bg-opacity-0 hover:bg-opacity-75 flex items-center justify-center transition-all duration-500 ease-in-out"
            style={{ transform: hover ? 'scale(1.1)' : 'scale(1)' }}
            >
                
                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-40"></div>
                <div className="absolute inset-0 py-12 flex flex-col justify-center">
                    <div className='text-center'>
                        <h3 className="bg-white hover:bg-opacity-20 bg-opacity-0 rounded-md p-2 mb-2 mt-2 font-extrabold text-white hover:text-violet-300 text-sm text-opacity-0 group-hover:text-opacity-100 transition-all duration-300">{title}</h3>
                        <p className="bg-white hover:bg-opacity-20 bg-opacity-0 rounded-md p-2 mt-2 mx-auto px-12 lg:px-4 font-md text-white text-xs text-opacity-0 group-hover:text-opacity-100 transition-all duration-300">{description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

function Services() {
    const servicesData = [
        {
            title: 'Technical Guides and Tutorials',
            description: "Our team of experts creates in-depth technical guides and tutorials to help you master the latest technologies and stay ahead of the curve.",
            imgSrc: '/imgs/online-technical-guides-and-tutorials.jpg',
            link: '/category/tech-guides',
        },
        {
            title: 'Free Online Resources',
            description: 'We provide a wide range of free online resources to help you improve your skills and stay up-to-date with the latest industry trends and best practices.',
            imgSrc: '/imgs/FreeOnlineResources.jpg',
            link: '/category/free-online-resources',
        },
        {
            title: 'Tips and Tricks',
            description: 'We share tips and tricks to help you optimize your workflows and streamline your development process.',
            imgSrc: '/imgs/TipsandTricks.jpg',
            link: '/category/tips-and-tricks',
        },
        {
            title: 'Online Events',
            description: 'We host online events, such as webinars and workshops, to help you learn from the best and connect with other professionals in your field.',
            imgSrc: '/imgs/OnlineEvents.jpg',
            link: '/category/events',
        },
        {
            title: 'News',
            description: 'We keep you up-to-date with the latest news and developments in the world of IT, so you never miss a beat.',
            imgSrc: '/imgs/News.jpg',
            link: '/category/news',
        },
    ];
    
    const tools = [
    {
        title: 'AskiboAI',
        description: "An AI-powered chatbot app built using OpenAI's GPT-3 API. Have a conversation with your AI friend and see where it takes you!💬",
        imgSrc: '/imgs/AskiboAi.gif',
        link: 'https://ask-chatgpt.programmerslife.site',
    },
    ];
    
    return (
        <>
        <Head>
            <title>{`Programmers Life > Services`}</title>
        </Head>
            <div className='bg-white dark:bg-gray-800 rounded-t-lg shadow-xl p-4 sm:p-8 mb-0 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl'>
                <div className="max-w-6xl py-12 sm:px-6 lg:px-8">
                    <div className="max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className='lg:text-5xl text-2xl text-pink-500 dark:text-indigo-400 leading-8 font-extrabold tracking-wide uppercase border-b pb-8 mb-8'>Our Services</h1>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {servicesData.map((service) => (
                                <Link key={service.title} href={service.link}>
                                    <Card key={service.title} {...service} />
                                </Link>
                            ))}
                        </div>
                        <div className="text-center">
                            <h1 className='lg:text-4xl text-2xl text-pink-500 dark:text-indigo-400 leading-8 font-extrabold tracking-wide uppercase border-b pb-4 mb-8 mt-8'>Our Online Tools</h1>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tools.map((tool) => (
                                <Link key={tool.title} href={tool.link}>
                                    <Card key={tool.title} {...tool} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Services

// Fetch data at build time
export async function getStaticProps() {
    const posts = (await getPosts()) || [];
    return {
      props: { posts },
    };
  }