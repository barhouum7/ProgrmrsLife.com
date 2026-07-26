import { request, gql } from 'graphql-request';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

/**
 * Fetch all guides (for the hub listing page).
 */
export const getGuides = async () => {
  const query = gql`
    query GetGuides {
      guides(orderBy: createdAt_DESC, stage: PUBLISHED) {
        title
        slug
        excerpt
        estimatedTime
        framework
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
    return result.guides || [];
  } catch (error) {
    console.error('Error fetching guides:', error);
    return [];
  }
};

/**
 * Fetch a single guide by slug (for the detail page).
 */
export const getGuideDetails = async (slug) => {
  const query = gql`
    query GetGuideDetails($slug: String!) {
      guide(where: { slug: $slug }, stage: PUBLISHED) {
        title
        slug
        excerpt
        estimatedTime
        framework
        featuredImage {
          url
        }
        content {
          raw
          html
          text
        }
        steps
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
    return result.guide;
  } catch (error) {
    console.error('Error fetching guide details:', error);
    return null;
  }
};

/**
 * Fetch all guide slugs (for getStaticPaths).
 */
export const getGuideSlugs = async () => {
  const query = gql`
    query GetGuideSlugs {
      guides(stage: PUBLISHED) {
        slug
      }
    }
  `;

  try {
    const result = await request(graphqlAPI, query);
    return result.guides || [];
  } catch (error) {
    console.error('Error fetching guide slugs:', error);
    return [];
  }
};

/**
 * Fetch guides filtered by framework.
 */
export const getGuidesByFramework = async (framework) => {
  const query = gql`
    query GetGuidesByFramework($framework: String!) {
      guides(where: { framework: $framework }, orderBy: createdAt_DESC, stage: PUBLISHED) {
        title
        slug
        excerpt
        estimatedTime
        framework
        featuredImage {
          url
        }
        createdAt
      }
    }
  `;

  try {
    const result = await request(graphqlAPI, query, { framework });
    return result.guides || [];
  } catch (error) {
    console.error('Error fetching guides by framework:', error);
    return [];
  }
};
