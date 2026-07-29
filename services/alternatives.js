import { request, gql } from 'graphql-request';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

/**
 * Fetch all alternative posts (for the hub listing page).
 */
export const getAlternativePosts = async () => {
  const query = gql`
    query GetAlternativePosts {
      alternativePosts(orderBy: createdAt_DESC, stage: PUBLISHED) {
        title
        slug
        excerpt
        targetSoftware
        targetSoftwareLogo {
          url
        }
        featuredImage {
          url
        }
        categories {
          name
          slug
        }
        author {
          name
          photo {
            url
          }
        }
        createdAt
        updatedAt
      }
    }
  `;

  try {
    const result = await request(graphqlAPI, query);
    return result.alternativePosts || [];
  } catch (error) {
    console.error('Error fetching alternative posts:', error);
    return [];
  }
};

/**
 * Fetch a single alternative post by slug (for the detail page).
 */
export const getAlternativePostDetails = async (slug) => {
  const query = gql`
    query GetAlternativePostDetails($slug: String!) {
      alternativePost(where: { slug: $slug }, stage: PUBLISHED) {
        title
        slug
        excerpt
        targetSoftware
        targetSoftwareLogo {
          url
        }
        featuredImage {
          url
        }
        content {
          raw
          html
          json
          text
        }
        alternatives
        seoKeywords
        categories {
          name
          slug
        }
        author {
          name
          bio
          photo {
            url
          }
        }
        createdAt
        updatedAt
      }
    }
  `;

  try {
    const result = await request(graphqlAPI, query, { slug });
    return result.alternativePost;
  } catch (error) {
    console.error('Error fetching alternative post details:', error);
    return null;
  }
};

/**
 * Fetch all alternative post slugs (for getStaticPaths).
 */
export const getAlternativePostSlugs = async () => {
  const query = gql`
    query GetAlternativePostSlugs {
      alternativePosts(stage: PUBLISHED) {
        slug
      }
    }
  `;

  try {
    const result = await request(graphqlAPI, query);
    return result.alternativePosts || [];
  } catch (error) {
    console.error('Error fetching alternative post slugs:', error);
    return [];
  }
};
