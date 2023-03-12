/** *****************************************************************************
 * Copyright (c)                                                                *
 * This source code is licensed under the MIT license                           *
 * found in the LICENSE file in the root directory of this source tree.         *
 * ******************************************************************************
 * Any file inside the folder pages/api is mapped to /api/*                     *
 * and will be treated as an API endpoint instead of a React component.         *
 ****************************************************************************** */


import { GraphQLClient, gql } from 'graphql-request';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;
const graphqlCMSToken = process.env.GRAPHCMS_TOKEN;

export default async function comments (req, res) {
    const graphQLClient = new GraphQLClient(graphqlAPI, {
        headers: {
            authorization: `Bearer ${graphqlCMSToken}`
        }
    });

    const query = gql`
        mutation CreateComment($name: String!, $email: String!, $comment: String!, $slug: String!) {
            createComment(data: {name: $name, email: $email, comment: $comment, post: {connect: {slug: $slug}} }) {
                id
            }
        }
    `;
    
    try {
        const result = await graphQLClient.request(query, req.body);
        return res.status(200).send(result);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    
}