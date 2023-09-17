import React from 'react';
import Image from 'next/image';
import { getPosts } from '../services/index';

const AboutUs = () => {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-t-lg shadow-xl p-8 sm:p-8 pb-12 m-0 mb-0 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl'>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="lg:text-4xl text-2xl text-pink-500 dark:text-indigo-400 leading-8 font-extrabold tracking-wide uppercase mb-8">About Us</h1>
        </div>
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-lg mb-8">Programmers Life is a community dedicated to helping IT professionals and enthusiasts by providing free resources, tools, and expert tips to help them succeed in their careers and stay up-to-date with the latest industry trends.</p>
        <h2 className="text-2xl font-bold mb-4">Our History</h2>
        <p className="text-lg mb-8">Programmers Life was founded in 2021 by Ibo, a software developer who recognized a need for a platform that could help connect programmers and provide valuable resources and information. Over the past few years, our community has grown to include over 2,000 members across our social media channels, and we continue to work hard to provide the best content possible to our readers.</p>
        <h2 className="text-2xl font-bold mb-8">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
          <div className="bg-white rounded-lg dark:bg-gray-800 shadow-xl p-8 sm:p-8 pb-12 m-0 mb-0 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl">
            <ul className="mb-8 relative">
              <li className="mb-4">
                <div className='flex mb-4'>
                  <div className='absolute -top-3'>
                  <Image
                      alt="Founder & CEO Portrait"
                      src="/imgs/ibo.png"
                      width={40}
                      height={40}
                      className='rounded-full cursor-pointer mr-0 inset-0 object-contain transition duration-700 ease-in-out transform hover:scale-110 hover:shadow-2xl hover:z-10'
                    />
                  </div>
                  <h3 className="ml-12 text-xl font-bold">Ibrahim BHMBS</h3>
                </div>
                <p className="text-lg mb-2 font-thin italic">Founder & CEO</p>
                <p className="text-lg mb-4">Ibo is a tech Enthusiast and an aspiring self-taught full-stack web2.0/Web3.0 Developer.<br />
                Experienced in Web Development using the most recent technologies, Linux System Administration, and Computer Networking.<br />
                He's passionate about sharing his knowledge and helping other programmers grow in their careers.</p>
              </li>
              {/* <li className="mb-4">
                <h3 className="text-xl font-bold">Jane Smith</h3>
                <p className="text-lg mb-2">Editor-in-Chief</p>
                <p className="text-lg mb-4">Jane has a background in journalism and is responsible for overseeing our content and ensuring that it meets our high standards for quality and accuracy.</p>
              </li>
              <li className="mb-4">
                <h3 className="text-xl font-bold">Mark Johnson</h3>
                <p className="text-lg mb-2">Lead Developer</p>
                <p className="text-lg mb-4">Mark is a talented developer who leads our development team and is responsible for ensuring that our platform is always up-to-date and running smoothly.</p>
              </li> */}
            </ul>
            </div>
          </div>
        <h2 className="text-2xl font-bold mb-4">Our Values</h2>
        <p className="text-lg mb-8">At Programmers Life, we're driven by a commitment to excellence, integrity, and community. We believe that by sharing our knowledge and supporting each other, we can all achieve greater success in our careers. We strive to provide accurate and up-to-date information to our readers, and we always welcome feedback and constructive criticism to help us improve.</p>
        <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
        <p className="text-lg mb-8">If you have any questions or feedback, please don't hesitate to get in touch with us. You can email us at <a href="mailto:contact@programmerslife.site" className="text-blue-500 hover:text-blue-700">contact@programmerslife.site</a> or follow us on Twitter <a href="https://twitter.com/mindh4q3rr" className="text-blue-500 hover:text-blue-700">@programmerslife</a>.</p>
        <h2 className="text-2xl font-bold mb-4">Connect with Us</h2>
        <ul className='text-lg mb-8'>
          <li><a href="https://twitter.com/mindh4q3rr">Twitter</a></li>
          <li><a href="https://www.facebook.com/mindh4q3rr">Facebook</a></li>
          <li><a href="https://www.linkedin.com/in/ibrahimbs">LinkedIn</a></li>
        </ul>
        
        <p className='text-lg mb-8'>Stay up-to-date with the latest news, tutorials, and resources from Programmers Life by subscribing to our newsletter. Just enter your email address below👇</p>
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