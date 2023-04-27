import React from 'react';
import Head from 'next/head';
import Script from 'next/script';
// import { useRouter } from 'next/router';

import { getCategories, getCategoryPost, getCategory, getPosts } from '../../services';
import { PostCard, Categories, Loader } from '../../components';

const CategoryPost = ({ catPosts, categoryName }) => {
//   const router = useRouter();

//   if (router.isFallback) {
//     return <Loader />;
//   }

  return (
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
      <meta http-equiv="Content-Language" content="en" />
      <meta name="language" content="English" />
      <meta property="og:title" content={`${categoryName} | Programmers Life`} />
      <meta property="og:description" content={
        `Programmers Life is a blog for programmers. We write about programming, web development, and software development.`
      } />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://programmerslife.site" />
      <meta property="og:site_name" content="Programmers Life" />
      <link rel="icon" href="/imgs/favicon.svg" />
      <link rel="canonical" href="https://programmerslife.site" />
      <link rel="alternate" href="https://programmerslife.site" hrefLang="en" />
      <link rel="alternate" href="https://programmerslife.site" hrefLang="x-default" />
      <link rel="alternate" href="https://programmerslife.site" hrefLang="en-US" />
    </Head>
    {/* <!-- Google tag (gtag.js) --> */}
    <Script 
        async 
        src="https://www.googletagmanager.com/gtag/js?id=G-PEF01PTY1T"
    />
    <Script>
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PEF01PTY1T');
        `}
    </Script>
    <div className="bg-white dark:bg-gray-800 rounded-t-lg shadow-xl lg:p-4 mb-0 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="col-span-1 lg:col-span-12 text-center">
          <h1 className="lg:text-4xl text-2xl text-pink-500 dark:text-indigo-400 leading-8 font-extrabold tracking-wide uppercase my-4">
            {categoryName}
          </h1>
        </div>
        <div className="col-span-1 lg:col-span-8">
          {catPosts.map((post, index) => (
            <PostCard key={post.node.title} post={post.node} />
          ))}
        </div>
        <div className="col-span-1 lg:col-span-4">
          <div className="relative lg:sticky top-8">
            <Categories />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
export default CategoryPost;

// Fetch data at build time
export async function getStaticProps({ params }) {
  const { slug } = params;
  const catPosts = await getCategoryPost(slug);
  const categoryName = await getCategory(slug);
  const posts = (await getPosts()) || [];

  return {
    props: {
      catPosts,
      categoryName,
      posts, // Passing this prop to be able to load posts from the Kbar Quick Search
    },
  };
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
    fallback: false,
  };
}