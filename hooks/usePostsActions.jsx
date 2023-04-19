import { useEffect, useState, useMemo } from "react";
import { useRegisterActions } from "kbar";

export default function usePostsActions(posts) {

  // console.log("Posts Results: ", posts);

  const defaultActions = useMemo(
    () => [
      {
        id: "loading-posts",
        name: "Loading Posts...",
        keywords: ["loading posts"],
        section: "",
        perform: () => {
          window.location.href = "/";
        },
        subtitle: "Loading Posts...",
        parent: "posts",
      },
    ],
    []
  );

  const postsActions = useMemo(() => {
    if (posts === undefined) {
      return defaultActions;
    }

      return posts.map((post, index) => ({
        id: post.node.slug,
        name: post.node.title,
        keywords: [post.node.title, post.node.slug],
        shortcut: ['p', index + 1],
        section: "",
        perform: () => {
          window.location.href = `/post/${post.node.slug}`;
        },
        subtitle: post.node.excerpt,
        parent: "posts",
      }));
  }, [posts]);

  // const postsActions = posts.map((post) => ({
  //       id: post.node.slug,
  //       name: post.node.title,
  //       keywords: [post.node.title, post.node.slug],
  //       section: "",
  //       perform: () => {
  //         window.location.href = `/post/${post.node.slug}`;
  //       },
  //       subtitle: post.node.excerpt,
  //       parent: "posts",
  //     }));

  useRegisterActions([
    {
      id: "posts",
      name: "Posts",
      shortcut: ["p", "o"],
      keywords: [
        "posts, posts page",
        "post, post page",
        "blog, blog page",
        "blogs, blogs page",
        "article, article page",
        "articles, articles page",
        "blog post, blog posts, blog post page, blog posts page, blogpost, blogposts, blogpost page, blogposts page",
      ],
      section: "Articles",
      subtitle: "Go to all posts",
      icon: <PostsIcon />,
    },
    // ...(isLoading || posts === undefined
    //   ? defaultActions
    //   : postsActions),
      // ...(posts !== undefined
      //   ? postsActions
      //   : [
      //       {
      //         id: "loading-posts",
      //         name: "Loading Posts...",
      //         keywords: ["loading posts"],
      //         section: "",
      //         perform: () => {
      //           window.location.href = "/";
      //         },
      //         subtitle: "Loading Posts...",
      //         parent: "posts",
      //       },
      //     ]
      //   // : defaultActions
      //     ),
    ...postsActions,
  ]);

  return null;
}

function PostsIcon () {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  )
}