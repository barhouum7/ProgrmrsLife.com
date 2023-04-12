import React from "react";
import { useRegisterActions } from "kbar";
import toast from "react-hot-toast";

function ToastDark({ title, action, buttonText }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ fontSize: 14 }}>{title}</span>
      <button
        onClick={action}
        // style={{
        //   background: "#fff",
        //   border: "none",
        //   boxShadow: "0 0 0 1px #000",
        //   padding: "4px 8px",
        //   cursor: "pointer",
        //   borderRadius: 4,
        //   fontSize: 14,
        // }}
        className="bg-black bg-opacity-10 dark:bg-black dark:bg-opacity-10 border border-gray-700 dark:border-gray-700 text-gray-300 text-sm dark:text-gray-300 rounded-md px-4 py-2 transition duration-150 ease-in-out hover:bg-gray-600 hover:bg-opacity-10 dark:hover:bg-gray-600 dark:hover:bg-opacity-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-900 cursor-pointer dark:active:bg-gray-900 active:text-gray-800"
      >
        {buttonText}
      </button>
    </div>
  );
}

function ToastLight({ title, action, buttonText }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ fontSize: 14 }}>{title}</span>
      <button
        onClick={action}
        // style={{
        //   background: "#fff",
        //   border: "none",
        //   boxShadow: "0 0 0 1px #000",
        //   padding: "4px 8px",
        //   cursor: "pointer",
        //   borderRadius: 4,
        //   fontSize: 14,
        // }}
        className="bg-white dark:bg-white border border-gray-500 dark:border-gray-500 text-gray-700 text-sm dark:text-gray-700 rounded-md px-4 py-2 transition duration-150 ease-in-out hover:bg-red-600 dark:hover:bg-red-600 hover:bg-opacity-10 dark:hover:bg-opacity-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-500 cursor-pointer dark:active:bg-gray-500 active:text-gray-800"
      >
        {buttonText}
      </button>
    </div>
  );
}

export default function useThemeActions() {
    // const {renderThemeChanger} = useContext(ScrollContext);
    useRegisterActions([
        {
            id: "theme",
            name: "Change theme…",
            keywords: "interface color dark light",
            shortcut: ["m"],
            section: "Preferences",
            icon: <ThemeIcon />,
        },
        {
            id: "darkTheme",
            name: "Dark",
            keywords: "dark theme",
            section: "",
            perform: (actionImpl) => {
                const attribute = "dark";
                // const doc = document.documentElement;
                // doc.setAttribute(attribute, "");
                const doc = document.documentElement;
                const nav = document.querySelector('nav');
                doc.classList.add(attribute);
                
                nav.style.backgroundColor = "rgba(28, 35, 43, 0.8)"; // Set the initial background color for dark mode

                toast(
                    <div>
                        <ToastDark
                            title={
                            <>
                                <span>Dark theme
                                    <span className="text-green-300 font-semibold">
                                        {" "}
                                        enabled
                                    </span>
                                </span>
                            </>
                            }
                            buttonText={
                            <>
                                <span className="font-bold">Undo</span>
                            </>
                            }
                            action={() => {
                            actionImpl.command.history.undo();
                            doc.classList.remove(attribute); // Remove the attribute from the document element
                            
                            nav.style.backgroundColor = "rgba(255, 255, 255, 0.9)"; // Set the background color for light mode
                            toast.dismiss("dark");

                            toast(
                                <ToastDark
                                    title={
                                        <>
                                            <span>Dark theme
                                                <span className="text-green-300 font-semibold">
                                                    {" "}
                                                    undone
                                                </span>
                                            </span>
                                        </>
                                    }
                                    buttonText={
                                        <>
                                            <span className="font-bold">Redo</span>
                                        </>
                                    }
                                    action={() => {
                                    actionImpl.command.history.redo();
                                    doc.classList.add(attribute); // Add the attribute back to the document element
                                    
                                    nav.style.backgroundColor = "rgba(28, 35, 43, 0.8)"; // Set the background color for dark mode
                                    toast.dismiss("dark-undo");
                                    }}
                                />,
                                {
                                    id: "dark-undo",
                                    position: "bottom-right",
                                    icon: "🌙",
                                    style: {
                                        background: "#1c1c1d",
                                        color: "#fff",
                                    },
                                }
                            );
                            }}
                        />
                    </div>,
                    {
                        id: "dark",
                        position: "bottom-right",
                        icon: "🌙",
                        style: {
                            background: "#1c1c1d",
                            color: "#fff",
                        },
                    }
                );
                return () => {
                    doc.classList.remove("dark");
                    
                    nav.style.backgroundColor = "rgba(255, 255, 255, 0.9)"; // Set the background color for light mode
                };
            },
            parent: "theme",
        },
        {
        id: "lightTheme",
        name: "Light",
        keywords: "light theme",
        section: "",
        perform: (actionImpl) => {
            const attribute = "dark";
            const doc = document.documentElement;
            const nav = document.querySelector('nav');
            const isDark = doc.classList.contains('dark') !== null;
            document.documentElement.classList.remove(attribute);
            
            nav.style.backgroundColor = "rgba(255, 255, 255, 0.9)"; // Set the initial background color for light mode

            toast(
            <div>
                <ToastLight
                title={
                    <>
                        <span>Light theme
                            <span className="text-green-500 font-semibold">
                                {" "}
                                enabled
                            </span>
                        </span>
                    </>
                }
                buttonText={
                    <>
                        <span className="font-bold">Undo</span>
                    </>
                }
                action={() => {
                    actionImpl.command.history.undo();
                    doc.classList.add(attribute); // Add the attribute back to the document element
                    
                    nav.style.backgroundColor = "rgba(28, 35, 43, 0.8)"; // Set the background color for dark mode
                    toast.dismiss("light");

                    toast(
                    <ToastLight
                        title={
                            <>
                                <span>Light theme
                                    <span className="text-green-500 font-semibold">
                                        {" "}
                                        undone
                                    </span>
                                </span>
                            </>
                        }
                        buttonText={
                            <>
                                <span className="font-bold">Redo</span>
                            </>
                        }
                        action={() => {
                        actionImpl.command.history.redo();
                        doc.classList.remove(attribute); // Remove the attribute from the document element
                        
                        nav.style.backgroundColor = "rgba(255, 255, 255, 0.9)"; // Set the background color for light mode
                        toast.dismiss("light-undo");
                        }}
                    />,
                    {
                        id: "light-undo",
                        position: "bottom-right",
                        icon: "🌞",
                        style: {
                            background: "#fff",
                            color: "#000",
                        },
                    }
                    );
                }}
                />
            </div>,
            {
                id: "light",
                position: "bottom-right",
                icon: "🌞",
                style: {
                    background: "#fff",
                    color: "#000",
                },
            }
            );

            return () => {
                if (isDark) {
                    doc.classList.add(attribute); // Add the attribute back to the document element
                    
                    nav.style.backgroundColor = "rgba(28, 35, 43, 0.8)"; // Set the background color for dark mode
                } else {
                    doc.classList.remove(attribute); // Remove the attribute from the document element
                    
                    nav.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                }
            };
        },
        parent: "theme",
        },
    ]);
}

function ThemeIcon () {
    return (
        <span className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">🌓</span>
    )
}


// function ThemeIcon () {
//     return (
//         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707M18.172 6.343l.707-.707M6.343 18.172l.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
//         </svg>
//     );
// }