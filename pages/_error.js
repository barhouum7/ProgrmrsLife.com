import React from 'react';
import PropTypes from 'prop-types';
import Error from 'next/error';
import Custom404 from './404';

export default function CustomError({ statusCode }) {
if (statusCode === 404) {
// Render the custom "404 Not Found" page
    return <Custom404 />;
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
