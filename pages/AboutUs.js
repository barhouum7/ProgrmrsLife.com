import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPosts } from '../services';
import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-t-lg shadow-xl p-8 sm:p-12 pb-12 m-0 mb-0 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl'>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="lg:text-5xl text-3xl text-pink-500 dark:text-indigo-400 leading-tight font-extrabold tracking-wide uppercase mb-4">About Programmers Life</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Empowering IT professionals and enthusiasts since 2021</p>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg mb-4">At Programmers Life, we're dedicated to helping IT professionals and enthusiasts thrive in their careers by providing:</p>
          <ul className="list-disc list-inside text-lg mb-4 ml-4">
            <li>Free, high-quality resources and tools</li>
            <li>Expert tips and industry insights</li>
            <li>A supportive community for knowledge sharing</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Journey</h2>
          <p className="text-lg mb-4">Founded in 2021 by Ibo, Programmers Life has grown from a passion project into a thriving community of over 40,000+ members across our social media channels. We're committed to continually improving and expanding our offerings to meet the evolving needs of the tech community.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Meet Our Founder</h2>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 flex flex-col md:flex-row items-start">
            <div className='w-[250px] h-[250px] overflow-hidden rounded-full mr-6 mb-4 md:mb-0 transition duration-700 ease-in-out transform hover:scale-110'>
              <Image
                alt="Founder & CEO Portrait"
                // src="/imgs/ibo.png"
                src="https://media.graphassets.com/IWnOhTnQBOKvyFS990lA"
                width={150}
                height={150}
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
                "I'm passionate about leveraging technology to solve real-world problems and helping fellow developers grow in their careers. At Programmers Life, we're building a community where knowledge sharing and continuous learning are at the forefront."
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Excellence', 'Integrity', 'Community'].map((value) => (
              <div key={value} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold mb-2">{value}</h3>
                <p className="text-lg">We strive for {value.toLowerCase()} in everything we do.</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="text-lg mb-4">Have questions or feedback? We'd love to hear from you!</p>
          <p className="text-lg mb-4">Email us at: <a href="mailto:contact@progrmrslife.com" className="text-blue-500 hover:text-blue-700">contact@progrmrslife.com</a></p>
        </section>

        <section className="mb-12">
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
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
          <p className="text-lg mb-4">Subscribe to our newsletter for the latest news, tutorials, and resources:</p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;

// Fetch data at build time
export async function getStaticProps() {
  const posts = (await getPosts()) || [];
  return {
    props: { posts },
  };
}