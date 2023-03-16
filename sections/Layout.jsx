import Header from "./Header/Header";
import Footer from "./FooterSection";
import { Subscribe, ScrollToTopButton } from "../components";
import Head from "next/head";

const Layout = ({ children}) => {
  return (
    <>
      <Head>
        <title>ProgrammersLife™</title>
        <link rel="icon" href="/imgs/favicon.svg" />
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
    </>
  );
};

export default Layout;
