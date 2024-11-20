require('dotenv').config();

const fs = require('fs').promises;
const prettier = require('prettier');
const { request, gql } = require('graphql-request');

const HYGRAPH_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

if (!HYGRAPH_ENDPOINT) {
  throw new Error('NEXT_PUBLIC_GRAPHCMS_ENDPOINT is not defined in the environment variables');
}

console.log('HYGRAPH_ENDPOINT:', HYGRAPH_ENDPOINT);

const GET_ALL_POSTS = gql`
  query GetPosts($first: Int!, $skip: Int!) {
    postsConnection(first: $first, skip: $skip, orderBy: createdAt_DESC) {
      edges {
        node {
          slug
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

const GET_ALL_CATEGORIES = gql`
  query GetCategories($first: Int!, $skip: Int!) {
    categoriesConnection(first: $first, skip: $skip) {
      edges {
        node {
          slug
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

async function fetchAllItems(query, itemType) {
  let allItems = [];
  let hasNextPage = true;
  let skip = 0;
  const first = 100; // Number of items to fetch per request

  while (hasNextPage) {
    const result = await request({
      url: HYGRAPH_ENDPOINT,
      document: query,
      variables: { first, skip }
    });

    const connection = result[`${itemType}Connection`];
    allItems = allItems.concat(connection.edges.map(edge => edge.node));
    hasNextPage = connection.pageInfo.hasNextPage;
    skip += first;
  }

  return allItems;
}

(async () => {
  try {
    const prettierConfig = await prettier.resolveConfig('./.prettierrc.js');
    
    console.log('Fetching all posts and categories...');
    
    const posts = await fetchAllItems(GET_ALL_POSTS, 'posts');
    const categories = await fetchAllItems(GET_ALL_CATEGORIES, 'categories');

    console.log(`Fetched ${posts.length} posts and ${categories.length} categories`);

    const sitemap = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>https://www.progrmrslife.com</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
        <url>
          <loc>https://www.progrmrslife.com/about-us</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
        <url>
          <loc>https://www.progrmrslife.com/contact-us</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
        <url>
          <loc>https://www.progrmrslife.com/services</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
        <url>
          <loc>https://www.progrmrslife.com/privacyPolicy</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
        </url>
        <url>
          <loc>https://www.progrmrslife.com/terms-and-conditions</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
        </url>
        <url>
          <loc>https://www.progrmrslife.com/canva-pro-invites</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
        </url>
        ${categories
          .map(({ slug, updatedAt }) => {
            return `
              <url>
                <loc>${`https://www.progrmrslife.com/category/${slug}`}</loc>
                <lastmod>${new Date(updatedAt).toISOString()}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.7</priority>
              </url>
            `;
          })
          .join('')}
        ${posts
          .map(({ slug, updatedAt }) => {
            return `
              <url>
                <loc>${`https://www.progrmrslife.com/post/${slug}`}</loc>
                <lastmod>${new Date(updatedAt).toISOString()}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.6</priority>
              </url>
            `;
          })
          .join('')}
      </urlset>
    `;

    const formatted = await prettier.format(sitemap, {
      ...prettierConfig,
      parser: 'html',
    });

    await fs.writeFile('public/sitemap.xml', formatted);

    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error details:', error);
    process.exit(1); // Exit with an error code
  }
})();
