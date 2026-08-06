import React, { useEffect, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { defaultFont } from '../config/fonts';
import ErrorBoundary from '../components/ErrorBoundary';
import { SuspenseLoader } from '../components';
import * as gtag from '../lib/gtag';
import { Analytics } from "@vercel/analytics/react"

import NextTopLoader from 'nextjs-toploader';

const ThemeProvider = dynamic(() => import('next-themes').then(mod => mod.ThemeProvider), { ssr: false });
const KBarProvider = dynamic(() => import('kbar').then(mod => mod.KBarProvider), { ssr: false });
const Toaster = dynamic(() => import('react-hot-toast').then(mod => mod.Toaster), { ssr: false });
const CommandBar = dynamic(() => import('../components/CommandBar'), { ssr: false });
const Layout = lazy(() => import('../sections/Layout'));

import { MyProvider } from '../contexts/MyContext';



import '../styles/globals.scss';
import '../styles/postDetail.css';
import '../styles/scrollbar.css';
import '../styles/moonSunBg.css';
import '../styles/loader.css';
import '../styles/FlyingHearts.css';
import '../styles/userWayAccessibility.css';
import '../styles/animation.css';
import '../styles/bannerAnimation.css';
import '../styles/toolsPage.css';

import 'tailwindcss/tailwind.css'


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
      window.location.href = "/about-us"
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
      window.location.href = "/services"
    },
    subtitle: "Go to the services page",
    icon: <ServicesIcon />,
  },

  {
    id: "tools",
    name: "Dev Tools",
    shortcut: ["t"],
    keywords: "tools json base64 regex hash color diff jwt url markdown",
    section: "Resources",
    perform: () => { window.location.href = "/tools" },
    subtitle: "Free online developer tools",
    icon: <ToolsIcon />,
  },
  {
    id: "guides",
    name: "Guides",
    shortcut: ["g"],
    keywords: "guides how-to tutorial code snippet fix",
    section: "Resources",
    perform: () => { window.location.href = "/guides" },
    subtitle: "How-to guides & code snippets",
    icon: <GuidesIcon />,
  },
  {
    id: "alternatives",
    name: "Alternatives",
    keywords: "alternatives compare software free open source",
    section: "Resources",
    perform: () => { window.location.href = "/alternatives" },
    subtitle: "Software comparison articles",
    icon: <AlternativesIcon />,
  },
]

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      // console.log("Route changed to: ", url);
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <ErrorBoundary>
      <main className={`${defaultFont.className} min-h-screen flex flex-col`}>
        <ThemeProvider enableSystem={true} attribute="class">
          <KBarProvider actions={actions}
            options={{
              enableHistory: true,
            }}
          >
            <MyProvider>
              <Suspense fallback={<SuspenseLoader />}>
                <Layout>
                  <Analytics />
                  <NextTopLoader 
                    color="#8A2BE2"
                    initialPosition={0.08}
                    crawlSpeed={200}
                    height={3}
                    crawl={true}
                    showSpinner={true}
                    easing="ease"
                    speed={200}
                    shadow="0 0 10px #FF69B4,0 0 5px #FF69B4"
                    template='<div class="bar" role="bar"><div class="peg"></div></div> 
                    <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                    zIndex={1600}
                    showAtBottom={false}
                  />
                  <CommandBar {...pageProps} />
                  <div className="flex-grow">
                    <Component {...pageProps} />
                  </div>
                </Layout>
              </Suspense>
            </MyProvider>
            <Toaster />
          </KBarProvider>
        </ThemeProvider>
      </main>
    </ErrorBoundary>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
  adBlockerDetected: PropTypes.bool,
};

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


function ToolsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  )
}

function GuidesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  )
}

function AlternativesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )
}
