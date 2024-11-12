import React from "react";
import PropTypes from "prop-types";
import HashLoader from "react-spinners/HashLoader";

const Loader = ({
  loading
}) => {
  return (
    <div className="loader-container">
      <HashLoader
        color={"#4F46E5"} // Indigo-600 color for better visibility
        loading={loading}
        size={90}
        aria-label="Loading spinner"
        data-testid="loader"
      />
    </div>
  );
};

Loader.propTypes = {
  loading: PropTypes.bool.isRequired
};

export default Loader;
