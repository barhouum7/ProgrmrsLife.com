import { request } from 'graphql-request';

const handleErrors = async (graphqlApi, query, variables) => {
  try {
    const data = await request(graphqlApi, query, variables);
    return data;
  } catch (error) {
    console.error(`GraphQL request failed: ${error.message}`);
    if (error.response) {
        // GraphQL error
        const message = error.response.errors[0].message;
        throw new Error(`GraphQL error: ${message}`);
    } else if (error.request) {
        // Network error
        throw new Error(`Network error: ${error.message}`);
    } else {
        // Other error
        throw new Error(`Unknown error occurred: ${error.message}`);
    }
  }
};

export default handleErrors;