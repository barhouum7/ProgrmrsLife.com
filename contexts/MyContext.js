import React, { createContext, useContext, useState } from 'react';
import PropTypes from "prop-types";

const MyContext = createContext();

export function MyProvider({ children }) {
const [isWelcomed, setIsWelcomed] = useState(false);

return (
    <MyContext.Provider value={{ isWelcomed, setIsWelcomed }}>
    {children}
    </MyContext.Provider>
);
}

MyProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export function useMyContext() {
    return useContext(MyContext);
}