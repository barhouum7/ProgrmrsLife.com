import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPosts } from '../services';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { AdUnit, Loader } from '../components';
import PropTypes from 'prop-types';

const AboutUs = ({ posts, error }) => {
  const [placeAdUnit, setPlaceAdUnit] = useState(false);

  useEffect(() => {
    setPlaceAdUnit(true);
  }, []);


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
  }
  , [posts, error]);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <>
      <Head>
        <title>About Us - Programmers Life</title>
        <meta name="description" content="Learn about Programmers Life, our mission, and the team behind empowering IT professionals and enthusiasts since 2021." />
      </Head>
      <motion.div 
        className='bg-white dark:bg-gray-800 rounded-t-lg shadow-xl p-8 sm:p-12 pb-12 m-0 mb-0 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl'
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
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
            <div className="max-w-4xl mx-auto">
              <motion.div className="text-center mb-12" variants={fadeInUp}>
                <h1 className="lg:text-5xl text-3xl text-pink-500 dark:text-indigo-400 leading-tight font-extrabold tracking-wide uppercase mb-4">About Programmers Life</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">Empowering IT professionals and enthusiasts since 2021</p>
              </motion.div>

              {placeAdUnit && (
                <AdUnit
                  client="ca-pub-5021308603136043"
                  slot="3167248456"
                />
              )}

              <motion.section className="mb-12" variants={fadeInUp}>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg mb-4">At Programmers Life, we&apos;re dedicated to helping IT professionals and enthusiasts thrive in their careers by providing:</p>
                <ul className="list-disc list-inside text-lg mb-4 ml-4">
                  <li>Free, high-quality resources and tools</li>
                  <li>Expert tips and industry insights</li>
                  <li>A supportive community for knowledge sharing</li>
                </ul>
              </motion.section>

              <motion.section className="mb-12" variants={fadeInUp}>
                <h2 className="text-3xl font-bold mb-6">Our Journey</h2>
                <p className="text-lg mb-4">Founded in 2021 by Ibo, Programmers Life has grown from a passion project into a thriving community of over 40,000+ members across our social media channels. We&apos;re committed to continually improving and expanding our offerings to meet the evolving needs of the tech community.</p>
              </motion.section>

              {placeAdUnit && (
                <AdUnit
                  client="ca-pub-5021308603136043"
                  slot="3167248456"
                />
              )}

              <motion.section className="mb-12" variants={fadeInUp}>
                <h2 className="text-3xl font-bold mb-6">Meet Our Founder</h2>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 flex flex-col md:flex-row items-start">
                  <div className='w-[250px] h-[250px] overflow-hidden rounded-full mr-6 mb-4 md:mb-0 transition duration-700 ease-in-out transform hover:scale-110'>
                    <Image
                      alt="Founder & CEO Portrait"
                      src="https://media.graphassets.com/IWnOhTnQBOKvyFS990lA"
                      width={250}
                      height={250}
                      layout="responsive"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Ibrahim Ben Salah</h3>
                    <p className="text-lg font-semibold text-pink-500 dark:text-indigo-400 mb-3">Founder & CEO</p>
                    <p className="text-lg mb-4">
                      Ibo is a passionate Tech Enthusiast, Full-Stack Developer, and Entrepreneur with a focus on SaaS Development. With over five years of hands-on experience in web development, he specializes in React.js and Next.js, bringing cutting-edge solutions to life.
                    </p>
                    <ul className="text-lg mb-4 list-disc list-inside">
                      <li>Skilled in the latest JavaScript technologies, blockchain DApp development, and MERN stack</li>
                      <li>Experienced in Linux system administration, cybersecurity, and cloud computing</li>
                      <li>Strong background in BigData, virtualization, computer networking, and network monitoring</li>
                      <li>Adept communicator dedicated to sharing knowledge and fostering growth in the tech community</li>
                    </ul>
                    <p className="text-lg italic">
                      &quot;I&apos;m passionate about leveraging technology to solve real-world problems and helping fellow developers grow in their careers. At Programmers Life, we&apos;re building a community where knowledge sharing and continuous learning are at the forefront.&quot;
                    </p>
                  </div>
                </div>
              </motion.section>

              {placeAdUnit && (
                <AdUnit
                  client="ca-pub-5021308603136043"
                  slot="3167248456"
                />
              )}

              <motion.section className="mb-12" variants={fadeInUp}>
                <h2 className="text-3xl font-bold mb-6">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Excellence', 'Integrity', 'Community'].map((value) => (
                    <div key={value} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 text-center">
                      <h3 className="text-xl font-bold mb-2">{value}</h3>
                      <p className="text-lg">We strive for {value.toLowerCase()} in everything we do.</p>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section className="mb-12" variants={fadeInUp}>
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                <p className="text-lg mb-4">Have questions or feedback? We&apos;d love to hear from you!</p>
                <p className="text-lg mb-4">Email us at: <a href="mailto:contact@progrmrslife.com" className="text-blue-500 hover:text-blue-700">contact@progrmrslife.com</a></p>
              </motion.section>

              {placeAdUnit && (
                <AdUnit
                  client="ca-pub-5021308603136043"
                  slot="3167248456"
                />
              )}

              <motion.section className="mb-12" variants={fadeInUp}>
                <h2 className="text-3xl font-bold mb-6">Connect with Us</h2>
                <div className="flex justify-center space-x-6">
                  {[
                    { icon: FaTwitter, href: 'https://twitter.com/mindh4q3rr', label: 'Twitter' },
                    { icon: FaFacebook, href: 'https://www.facebook.com/mindh4q3rr', label: 'Facebook' },
                    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/ibrahimbs', label: 'LinkedIn' },
                  ].map(({ icon: Icon, href, label }) => (
                    <Link key={label} href={href} passHref>
                      <span className="text-3xl text-gray-600 hover:text-pink-500 dark:text-gray-300 dark:hover:text-indigo-400 transition duration-300" aria-label={label}>
                        <Icon />
                      </span>
                    </Link>
                  ))}
                </div>
              </motion.section>

              <motion.section variants={fadeInUp}>
                <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
                <p className="text-lg mb-4">Subscribe to our newsletter for the latest news, tutorials, and resources:</p>
                {/* Add your newsletter subscription form here */}
              </motion.section>
            </div>
          </>
        )}
      </motion.div>
    </>
  );
};

AboutUs.propTypes = {
  posts: PropTypes.array,
  error: PropTypes.bool,
};

export default AboutUs;

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