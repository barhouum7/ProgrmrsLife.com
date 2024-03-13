import GridLoader from "react-spinners/GridLoader";

const Loader = ({
  loading
}) => {
  return (
    <div className="loader-container">
      <GridLoader
        color={"white"}
        loading={loading}
        size={30}
        aria-label="Loading spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
