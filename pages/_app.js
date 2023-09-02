import { MyProvider } from "../contexts/MyContext";
import { Layout } from "../sections";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from 'react-helmet-async';
import { KBarProvider } from "kbar";
import CommandBar from "../components/CommandBar";

import '../styles/globals.scss'
import '../styles/postDetail.css'
import '../styles/scrollbar.css'
import '../styles/moonSunBg.css'
import '../styles/loader.css'
import '../styles/animation.css'

import 'tailwindcss/tailwind.css'
import 'react-toastify/dist/ReactToastify.css';


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
    <>
      <HelmetProvider>
        <ThemeProvider enableSystem={true} attribute="class">
          <KBarProvider actions={actions}
            options={{
              enableHistory: true,
            }}
          >
            <MyProvider>
              <Layout>
                <CommandBar {...pageProps} />
                <Component {...pageProps} />
              </Layout>
            </MyProvider>
            <Toaster
              // toastOptions={{
              //   position: "bottom-right",
              // }}
            />
          </KBarProvider>
        </ThemeProvider>
      </HelmetProvider>
    </>
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