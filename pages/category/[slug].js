import React from 'react';
// import { useRouter } from 'next/router';

import { getCategories, getCategoryPost, getCategory, getPosts } from '../../services';
import { PostCard, Categories, Loader } from '../../components';

const CategoryPost = ({ posts, categoryName }) => {
//   const router = useRouter();

//   if (router.isFallback) {
//     return <Loader />;
//   }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-t-lg shadow-xl lg:p-4 mb-0 transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="col-span-1 lg:col-span-12 text-center">
          <h1 className="lg:text-4xl text-2xl text-pink-500 dark:text-indigo-400 leading-8 font-extrabold tracking-wide uppercase my-4">
            {categoryName}
          </h1>
        </div>
        <div className="col-span-1 lg:col-span-8">
          {posts.map((post, index) => (
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
      posts,
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