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

export default Loader;
