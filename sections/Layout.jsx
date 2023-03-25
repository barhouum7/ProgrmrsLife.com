import Header from "./Header/Header";
import Footer from "./FooterSection";
import { Subscribe, ScrollToTopButton, ConsentPreferenceLink } from "../components";
import Head from "next/head";

const Layout = ({ children}) => {
  return (
    <>
      <Head>
        <title>ProgrammersLife™</title>
        <link rel="icon" href="/imgs/favicon.svg" />
        <script
          type="text/javascript"
          src="https://app.termly.io/embed.min.js"
          data-auto-block="off"
          data-website-uuid="6be0f015-e759-4ffd-8346-ebb290ddbdf9"
          async
        />
      </Head>
        <Header />
        <main className="container relative flex-grow rounded-t mx-auto transition ease-in-out duration-500">
            {children}
        </main>
        <ScrollToTopButton />
        
        <Subscribe />
        {/* <div className="dark:bg-gray-800 flex-grow container rounded-b mx-auto px-10 mb-1 sm:px-6 transition ease-in-out duration-500"> */}
        <Footer />
        {/* </div> */}
        <div className="h-16 z-10 fixed bottom-0 left-0 w-screen">
          <ConsentPreferenceLink />
        </div>
    </>
  );
};

export default Layout;
