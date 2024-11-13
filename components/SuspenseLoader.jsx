import React from 'react';
import BarLoader from "react-spinners/BarLoader";
import { useTheme } from "next-themes";

const SuspenseLoader = () => {
  const { theme } = useTheme();

  // Determine color based on theme
  const loaderColor = theme === 'dark' ? "#60A5FA" : "#BFDBFE"; // Light blue for dark mode, very light blue for light mode

  return (
    <div className="fixed top-0 left-0 w-screen z-50">
      <BarLoader
        color={loaderColor}
        loading={true}
        width="100%"
        height={4}
        aria-label="Loading bar"
        data-testid="loader"
      />
    </div>
  );
};

export default SuspenseLoader;