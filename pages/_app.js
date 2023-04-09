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
  ActionId,
  ActionImpl,
  NO_GROUP
} from "kbar";
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
      currentRootActionId = ActionId.NO_ACTION,
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
                      style={{
                        opacity: 0.5,
                        marginRight: 8,
                        background: "rgba(0 0 0 / .1)",
                        padding: "4px 6px",
                        borderRadius: "4px",
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
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
                style={{
                  padding: "4px 6px",
                  background: "rgba(0 0 0 / .1)",
                  borderRadius: "4px",
                  fontSize: 14,
                }}
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
  },
  {
    id: "contact",
    name: "Contact",
    shortcut: ["c"],
    section: "Navigation",
    keywords: ["contact, contact us, contact us page, contact page, email, email us, email us page, email page"],
    perform: () => {
      window.location.href = "/ContactUs"
    },
    subtitle: "Go to the contact page",
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
  },
  {
    id: "free-online-resources",
    name: "Free Online Resources",
    shortcut: ["f", "r"],
    keywords: ["free, free online resources, free online resources page, free resources, free resources page, free online, free online page, free page, online resources, online resources page, online, online page, resources, resources page"],
    section: "Categories",
    perform: () => {
      window.location.href = "/category/free-online-resources"
    },
    subtitle: "Go to the free online resources category page",
  },
  {
    id: "tech-guides",
    name: "Tech Guides",
    shortcut: ["t", "g"],
    keywords: ["tech, tech guides, tech guides page, guides, guides page, tech page, guides page"],
    section: "Categories",
    perform: () => {
      window.location.href = "/category/tech-guides"
    },
    subtitle: "Go to the tech guides category page",
  },
  {
    id: "web-dev",
    name: "Web Development",
    shortcut: ["w", "d"],
    keywords: ["web, web dev, web development, web development page, web dev page, development, development page, dev, dev page"],
    section: "Categories",
    perform: () => {
      window.location.href = "/category/web-dev"
    },
    subtitle: "Go to the web development category page",
  },
  {
    id: "tips-and-tricks",
    name: "Tips & Tricks",
    shortcut: ["t"],
    keywords: ["tips, tricks, tips and tricks, tips & tricks, tips and tricks page, tips & tricks page, tips page, tricks page"],
    section: "Categories",
    perform: () => {
      window.location.href = "/category/tips-and-tricks"
    },
    subtitle: "Go to the tips and tricks category page",
  },
  {
    id: "linux-sys-admin",
    name: "Linux Sys Admin",
    shortcut: ["l", "a"],
    keywords: ["linux, linux sys admin, linux sys admin page, linux system admin, linux system admin page, linux system administration, linux system administration page, linux administration, linux administration page, linux admin, linux admin page, linux administration, linux administration page, linux sys, linux sys page, linux system, linux system page, linux system administration, linux system administration page, linux administration, linux administration page, linux admin, linux admin page, linux administration, linux administration page, sys admin, sys admin page, system admin, system admin page, system administration, system administration page, administration, administration page, admin, admin page, administration, administration page, sys, sys page, system, system page, system administration, system administration page, administration, administration page, admin, admin page, administration, administration page"],
    section: "Categories",
    perform: () => {
      window.location.href = "/category/linux-sys-admin"
    },
    subtitle: "Go to the linux sys admin category page",
  },
  {
    id: "news",
    name: "News",
    shortcut: ["n"],
    keywords: ["news, news page"],
    section: "Categories",
    perform: () => {
      window.location.href = "/category/news"
    },
    subtitle: "Go to the news category page",
  },
  {
    id: "events",
    name: "Events",
    shortcut: ["e"],
    keywords: ["events, events page"],
    section: "Categories",
    perform: () => {
      window.location.href = "/category/events"
    },
    subtitle: "Go to the events category page",
  },
  {
    id: "twitterAction",
    name: "Twitter",
    shortcut: ["g", "t"],
    keywords: "social contact dm",
    section: "Social Media",
    perform: () => window.open("https://twitter.com/mindh4q3rr", "_blank"),
    subtitle: "Go to our Twitter profile",
  },
  createAction({
    name: "Github",
    shortcut: ["g"],
    keywords: "sourcecode",
    section: "Social Media",
    perform: () => window.open("https://github.com/barhouum7", "_blank"),
    subtitle: "Go to our Github profile",
  }),
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
    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m19.681 10.406-7.09-6.179a.924.924 0 0 0-1.214.002l-7.06 6.179c-.642.561-.244 1.618.608 1.618.51 0 .924.414.924.924v5.395c0 .51.414.923.923.923h3.236V14.54c0-.289.234-.522.522-.522h2.94c.288 0 .522.233.522.522v4.728h3.073c.51 0 .924-.413.924-.923V12.95c0-.51.413-.924.923-.924h.163c.853 0 1.25-1.059.606-1.62Z"
        fill="currentColor" className="text-gray-500 dark:text-gray-400"
      />
    </svg>
  );
}