import React, { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast";
import { Layout } from "../sections"
import { ThemeProvider } from "next-themes"
import { HelmetProvider } from 'react-helmet-async';
import { 
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  KBarResults,
  useMatches,
  createAction,
  useRegisterActions,
  ActionId,
  ActionImpl,
  NO_GROUP
} from "kbar";
import usePostsActions from "../hooks/usePostsActions";
import useCategoriesActions from "../hooks/useCategoriesActions";
import useThemeActions from "../hooks/useThemeActions";

import '../styles/globals.scss'
import '../styles/postDetail.css'
import '../styles/scrollbar.css'

import 'tailwindcss/tailwind.css'

const searchStyle = {
  padding: "12px 16px",
  fontSize: "16px",
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
  border: "none",
  background: "var(--background)",
  color: "var(--foreground)",
  
};
// TailwindCSS equivalent
// const searchStyle = "p-3 text-base w-full box-border outline-none border-none bg-gray-900 text-gray-100";

const animatorStyle = {
  maxWidth: "600px",
  width: "100%",
  // background: "rgba(23, 23, 23, 0.9)",
  background: "#1a202c",
  // background: "#1c1c1c",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "var(--shadow)",
};

// TailwindCSS equivalent
// const animatorStyle = "max-w-600 w-full bg-gray-100 dark:bg-gray-900 text-white rounded-lg overflow-hidden shadow-lg";

const groupNameStyle = {
  padding: "8px 16px",
  fontSize: "10px",
  textTransform: "uppercase",
  opacity: 0.5,
};

const RenderResults = () => {
  const { results, rootActionId } = useMatches();
  
  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div style={groupNameStyle}>{item}</div>
        ) : (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId}
          />
        )
      }
    />
  )
}

const ResultItem = React.forwardRef(
  (
    {
      action = ActionImpl.NO_ACTION,
      active,
      currentRootActionId,
    },
    ref
  ) => {
    const ancestors = React.useMemo(() => {
      if (!currentRootActionId) return action.ancestors;
      const index = action.ancestors.findIndex(
        (ancestor) => ancestor.id === currentRootActionId
      );
      // +1 removes the currentRootAction; e.g.
      // if we are on the "Set theme" parent action,
      // the UI should not display "Set theme… > Dark"
      // but rather just "Dark"
      return action.ancestors.slice(index + 1);
    }, [action.ancestors, currentRootActionId]);

    return (
      <div
        ref={ref}
        style={{
          // padding: "12px 16px",
          // background: active ? "rgba(0 0 0 / .1)" : "transparent",
          // borderLeft: `2px solid ${
          //   active ? "white" : "transparent"
          // }`,
          // display: "flex",
          // alignItems: "center",
          // justifyContent: "space-between",
          // cursor: "pointer",
        }}
        className={`dark:hover:bg-transparent dark:bg-black dark:bg-opacity-10 flex justify-between items-center cursor-pointer p-3 border-l-2 border-black dark:border-white border-opacity-0 dark:border-opacity-0
          ${active ? "bg-gray-100 text-gray-900 dark:text-gray-100 dark:bg-transparent dark:bg-opacity-10 border-opacity-100 dark:border-opacity-100" : "bg-white text-gray-900 dark:text-white"}
          `}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            fontSize: 14,
          }}
        >
          {action.icon && action.icon}
          <div style={{ display: "flex", flexDirection: "column",
            gap: "4px",
            padding: "8px",
            borderRadius: "8px",
          }}>
            <div>
              {ancestors.length > 0 &&
                ancestors.map((ancestor) => (
                  <React.Fragment key={ancestor.id}>
                    <span
                      // style={{
                      //   opacity: 0.5,
                      //   marginRight: 8,
                      //   background: "rgba(0 0 0 / .1)",
                      //   padding: "4px 6px",
                      //   borderRadius: "4px",
                      //   color: "rgba(255, 255, 255, 0.7)",
                      // }}
                      className="mr-2 bg-gray-800 bg-opacity-10 dark:bg-gray-300 dark:bg-opacity-10 text-gray-900 dark:text-gray-100 rounded px-2 py-1"
                    >
                      {ancestor.name}
                    </span>
                    <span
                      style={{
                        marginRight: 8,
                      }}
                    >
                      &rsaquo;
                    </span>
                  </React.Fragment>
                ))}
              <span>{action.name}</span>
            </div>
            {action.subtitle && (
              <span style={{ fontSize: 12,
                opacity: 0.7,
                marginTop: 4,
              }}>{action.subtitle}</span>
            )}
          </div>
        </div>
        {action.shortcut?.length ? (
          <div
            aria-hidden
            style={{ display: "grid", gridAutoFlow: "column", gap: "4px" }}
          >
            {action.shortcut.map((sc) => (
              <kbd
                key={sc}
                // style={{
                //   padding: "4px 6px",
                //   background: "rgba(0 0 0 / .1)",
                //   borderRadius: "4px",
                //   fontSize: 14,
                // }}
                // className="bg-gray-800 bg-opacity-10 dark:bg-gray-300 dark:bg-opacity-10 text-gray-900 dark:text-gray-100 rounded px-2 py-1"
                className="rounded bg-gray-300 dark:bg-gray-700 cursor-pointer px-2 my-1 text-sm tracking-normal border-gray-400 border-opacity-20 border-b-2 hover:border-none hover:shadow-inner hover:bg-gray-200 dark:hover:bg-gray-600 shadow-darker text-grey-600 dark:text-white"
              >
                {sc}
              </kbd>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
);

function CommandBar() {
  usePostsActions();
  useCategoriesActions();
  useThemeActions();
  return (
    <KBarPortal> 
    {/* Renders the content outside the root node */}
    <KBarPositioner>
      {/* Position the KBar, Centers the content by default */}
      <KBarAnimator
        // style={animatorStyle}
        className="bg-white dark:bg-gray-800 dark:text-white text-black rounded-lg overflow-hidden shadow-lg sm:max-w-4xl sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden transition duration-700 ease-in-out transform hover:shadow-indigo-500/40 hover:shadow-2xl"
        // className={`${animatorStyle} dark:${animatorStyle["--background"]} dark:${animatorStyle["--foreground"]}`}
      >
        {/* Handles the show/hide and height animations */}
        <KBarSearch
          style={searchStyle}
          // className="bg-white dark:bg-gray-800 dark:text-white text-black"
          // className={`${searchStyle} dark:${searchStyle["--background"]} dark:${searchStyle["--foreground"]}`}
        />
        {/* Renders the search input */}
        <RenderResults />
        {/* Renders the results */}
          <div>
              <div className="flex items-center justify-center w-full py-2 px-2 rounded border-t border-l border-r border-white dark:border-transparent leading-none">
                <span className="text-xs tracking-tighter">
                  <kbd className="rounded bg-gray-300 dark:bg-gray-700 cursor-pointer px-1 border-gray-400 border-opacity-20 border-b-2 hover:border-none hover:shadow-inner hover:bg-gray-200 dark:hover:bg-gray-600 shadow-darker text-grey-600 dark:text-white mr-2">
                    Enter ↩
                  </kbd>
                </span>
                <span className="text-xs mr-4 tracking-normal text-gray-600 dark:text-gray-400">
                  to select
                </span>
                <span className="text-xs tracking-tighter">
                  <kbd className="rounded bg-gray-300 dark:bg-gray-700 cursor-pointer px-1 border-gray-400 border-opacity-20 border-b-2 hover:border-none hover:shadow-inner hover:bg-gray-200 dark:hover:bg-gray-600 shadow-darker text-grey-600 dark:text-white mr-2">
                    ↑
                  </kbd>
                  <kbd className="rounded bg-gray-300 dark:bg-gray-700 cursor-pointer px-1 border-gray-400 border-opacity-20 border-b-2 hover:border-none hover:shadow-inner hover:bg-gray-200 dark:hover:bg-gray-600 shadow-darker text-grey-600 dark:text-white mr-2">
                    ↓
                  </kbd>
                </span>
                <span className="text-xs mr-4 tracking-normal text-gray-600 dark:text-gray-400">
                  to navigate
                </span>
                <span className="text-xs tracking-tighter">
                  <kbd className="rounded bg-gray-300 dark:bg-gray-700 cursor-pointer px-1 border-gray-400 border-opacity-20 border-b-2 hover:border-none hover:shadow-inner hover:bg-gray-200 dark:hover:bg-gray-600 shadow-darker text-grey-600 dark:text-white mr-2">
                    Esc
                  </kbd>
                </span>
                <span className="text-xs mr-4 tracking-normal text-gray-600 dark:text-gray-400">
                  to close the search
                </span>
              </div>
          </div>
      </KBarAnimator>
    </KBarPositioner>
  </KBarPortal>
  )
}


function MyApp({ Component, pageProps }) {
const actions = [

  {
    id: "home",
    name: "Home",
    shortcut: ["h"],
    keywords: ["home"],
    section: "Navigation",
    perform: () => {
      window.location.href = "/"
    },
    icon: <HomeIcon />,
    subtitle: "Go to the home page",
  },
  {
    id: "about",
    name: "About",
    shortcut: ["a"],
    keywords: ["about"],
    section: "Navigation",
    perform: () => {
      window.location.href = "/AboutUs"
    },
    subtitle: "Go to the about page",
    icon: <AboutIcon />,
  },
  {
    id: "services",
    name: "Services",
    shortcut: ["s"],
    keywords: ["services, services page"],
    section: "Navigation",
    perform: () => {
      window.location.href = "/Services"
    },
    subtitle: "Go to the services page",
    icon: <ServicesIcon />,
  },
]

  return (
    <HelmetProvider>
      <ThemeProvider enableSystem={true} attribute="class">
        <KBarProvider actions={actions}
          options={{
            enableHistory: true,
          }}
        >
          <CommandBar />
          <Layout>
              <Component {...pageProps} />
          </Layout>
          
        </KBarProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default MyApp

function HomeIcon() {
  return (
    <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 -ml-1 -mr-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
      <path
        d="m19.681 10.406-7.09-6.179a.924.924 0 0 0-1.214.002l-7.06 6.179c-.642.561-.244 1.618.608 1.618.51 0 .924.414.924.924v5.395c0 .51.414.923.923.923h3.236V14.54c0-.289.234-.522.522-.522h2.94c.288 0 .522.233.522.522v4.728h3.073c.51 0 .924-.413.924-.923V12.95c0-.51.413-.924.923-.924h.163c.853 0 1.25-1.059.606-1.62Z"
        fill="currentColor"
      />
    </svg>
  );
}

function AboutIcon () {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
        <path fill="currentColor" d="M12 22c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zm0-2c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zM11 7h2v6h-2zm0 8h2v2h-2z"/>
    </svg>
  )
}

function ServicesIcon () {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 -ml-1 -mr-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
      <path d="M5 5H19V19H5V5ZM7 7V17H17V7H7ZM8.5 8.5H11.5V10.5H8.5V8.5ZM12.5 8.5H15.5V10.5H12.5V8.5ZM8.5 11.5H11.5V13.5H8.5V11.5ZM12.5 11.5H15.5V13.5H12.5V11.5ZM8.5 14.5H11.5V16.5H8.5V14.5ZM12.5 14.5H15.5V16.5H12.5V14.5Z" fill="currentColor"/>
    </svg>
  )
}