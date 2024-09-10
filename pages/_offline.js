import Head from 'next/head';
import Link from 'next/link';

const Offline = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Head>
        <title>Offline - Programmer's Life Blog</title>
        <meta name="description" content="You are currently offline. Please check your internet connection." />
      </Head>

      <main className="text-center px-4">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Oops! You're Offline
        </h1>
        <p className="text-xl mb-8 text-gray-600 dark:text-gray-400">
          It seems you've lost your internet connection. Don't worry, our blog is still here!
        </p>
        <div className="mb-8">
          <svg className="w-24 h-24 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
          Try these options:
        </p>
        <ul className="list-disc list-inside text-left max-w-md mx-auto mb-8 text-gray-600 dark:text-gray-400">
          <li>Check your internet connection</li>
          <li>Refresh the page once you're back online</li>
          <li>Return to our homepage when connection is restored</li>
        </ul>
        <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
          Try going to Homepage
        </Link>
      </main>

      <footer className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Programmer's Life Blog. All rights reserved.
      </footer>
    </div>
  );
};

export default Offline;
