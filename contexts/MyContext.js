import React, { createContext, useContext, useState } from 'react';

const MyContext = createContext();

export function MyProvider({ children }) {
const [isWelcomed, setIsWelcomed] = useState(false);

return (
    <MyContext.Provider value={{ isWelcomed, setIsWelcomed }}>
    {children}
    </MyContext.Provider>
);
}

export function useMyContext() {
    return useContext(MyContext);
}