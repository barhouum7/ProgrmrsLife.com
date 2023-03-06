import Header from "./Header/Header";
import Footer from "./Footer";
import Head from "next/head";

const Layout = ({ children}) => {
  return (
    <>
      <Head>
        <title>Programmers Life Blog</title>
        <link rel="icon" href="/imgs/favicon.svg" />
      </Head>
      
        <Header />
        
        <main className="dark:bg-gray-800 container relative flex-grow rounded-t mx-auto mt-20 p-4 sm:px-6 trasition ease-in-out duration-500">
            {children}
        </main>

        <div className="dark:bg-gray-800 flex-grow container rounded-b mx-auto px-10 mb-1 sm:px-6 trasition ease-in-out duration-500">
        <Footer />
        </div>
    </>
  );
};

export default Layout;
