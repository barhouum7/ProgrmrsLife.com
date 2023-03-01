import { request, gql } from 'graphql-request'
import * as dotenv from 'dotenv';

/* Here in order to load that Variable inside dotenv file
    we just do a simple check If we are 
    running in the production environment or Not... */
    if (process.env.NODE_ENV !== 'production') {
        dotenv.config();
    }

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
                updatedAt
              }
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
}