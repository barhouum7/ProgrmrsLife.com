import React from 'react';
import PropTypes from 'prop-types';
import Error from 'next/error';
import Error404_pageNF from './Error404_pageNF';

export default function CustomError({ statusCode }) {
if (statusCode === 404) {
    // Render the custom "404 Not Found" page
    return <Error404_pageNF />;
}

// Render the default error page
return <Error statusCode={statusCode} />;
}

CustomError.propTypes = {
statusCode: PropTypes.number,
};

CustomError.getInitialProps = ({ res, err }) => {
const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
return { statusCode };
};
