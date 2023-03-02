import { request, gql } from 'graphql-request'
// import * as dotenv from 'dotenv';

/* Here in order to load that Variable inside dotenv file
    we just do a simple check If we are 
    running in the production environment or Not... */
    // if (process.env.NODE_ENV !== 'production') {
        // dotenv.config();
    // }

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT


export const getPosts = async () => {
    const query = gql`
    query MyQuery {
        postsConnection {
          edges {
            node {
              author {
                bio
                name
                id
                photo {
                  url
                }
              }
              createdAt
              slug
              title
              excerpt
              featuredImage {
                url
              }
              categories {
                name
                slug
              }
            }
          }
        }
      }
    `
    const result = await request(graphqlAPI, query)

    // return result.postsConnection.edges.map(({ node }) => node)
    return result.postsConnection.edges;
};

export const getRecentPosts = async () => {
    const query = gql`
    query getPostDetails () {
        posts(
            orderBy: createdAt_ASC
            last: 3
        ) {
            title
            featuredImage {
                url
            }
            createdAt
            slug
        }
    }
    `
    const result = await request(graphqlAPI, query)
    return result.posts;
}


export const getSimilarPosts = async () => {
    const query = gql`
    query getPostDetails ($slug: String!, $categories: [String!]) {
        posts(
            where: {
                slug_not: $slug, AND: { categories_some: { slug_in: $categories }}
            }
            last: 3
        ) {
            title
            featuredImage {
                url
            }
            createdAt
            slug
        }
    }
    `
    const result = await request(graphqlAPI, query)
    return result.posts;
}