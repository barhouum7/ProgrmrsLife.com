import Header from "./Header/Header";
import Footer from "./FooterSection";
import { Subscribe } from "../components";
import Head from "next/head";

const Layout = ({ children}) => {
  return (
    <>
      <Head>
        <title>ProgrammersLife™</title>
        <link rel="icon" href="/imgs/favicon.svg" />
      </Head>
      
        <Header />
        
        <main className="dark:bg-gray-800 container relative flex-grow rounded-t mx-auto p-2 transition ease-in-out duration-500">
            {children}
        </main>
        
        <Subscribe />
        {/* <div className="dark:bg-gray-800 flex-grow container rounded-b mx-auto px-10 mb-1 sm:px-6 transition ease-in-out duration-500"> */}
        <Footer />
        {/* </div> */}
    </>
  );
};

export default Layout;
