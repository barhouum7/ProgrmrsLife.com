import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';
import { motion } from 'framer-motion';
import { getAlternativePosts } from '../../services/alternatives';
import { AdsenseScript } from '../../components';
import Image from 'next/image';
import NativeAdBanner from '../../components/ads/NativeAdBanner';

export default function AlternativesHub({ posts }) {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Head>
        <title>Best Software Alternatives — Free & Open Source | ProgrmrsLife</title>
        <meta name="description" content="Discover the best free and open-source alternatives to popular software. Side-by-side comparisons with pricing, pros, cons, and ratings." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Best Software Alternatives — ProgrmrsLife" />
        <meta property="og:description" content="Discover the best free and open-source alternatives to popular software." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.progrmrslife.com/alternatives" />
        <link rel="canonical" href="https://www.progrmrslife.com/alternatives" />
      </Head>

      <Script id="alternatives-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Software Alternatives",
          "description": "Best free and open-source software alternatives and comparisons.",
          "url": "https://www.progrmrslife.com/alternatives",
        })}
      </Script>

      <motion.div
        initial="initial"
        animate="animate"
        variants={{ initial: { opacity: 0 }, animate: { opacity: 1 } }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Hero */}
        <motion.div className="text-center mb-12" variants={fadeInUp} transition={{ duration: 0.5 }}>
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4
                        bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span>⇄</span>
            <span>Honest, Detailed Comparisons</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            <span className="text-gray-900 dark:text-white">Software </span>
            <span className="tool-gradient-text">Alternatives</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find the best free and open-source alternatives to popular tools.
            Side-by-side comparisons with real pros, cons, and pricing.
          </p>
        </motion.div>

        {/* Ad Slot */}
        <div className="mb-8">
          <AdsenseScript />
          <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-5021308603136043"
            data-ad-slot="3167248456"
            data-ad-format="auto"
            data-full-width-responsive="true" />
        </div>

        {/* Posts Grid */}
        {posts && posts.length > 0 ? (
          <div className="tools-grid">
            {posts.map((post, index) => (
              <motion.div
                key={post.slug}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <Link href={`/alternatives/${post.slug}`} className="block h-full">
                  <div className="tool-card tool-glass h-full">
                    {/* Target Software */}
                    <div className="flex items-center gap-3 mb-3">
                      {post.targetSoftwareLogo?.url && (
                        <div className='relative flex-none w-10 h-10'>
                          <Image fill src={post.targetSoftwareLogo.url} alt={post.targetSoftware} className="rounded-lg object-contain" />
                        </div>
                      )}
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        vs {post.targetSoftware}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Categories */}
                    {post.categories?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.categories.slice(0, 3).map((cat) => (
                          <span key={cat.slug} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-sm font-semibold text-violet-600 dark:text-violet-400">
                      <span>Read Comparison</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">⇄</span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Coming Soon</h2>
            <p className="text-gray-500 dark:text-gray-400">We&apos;re preparing in-depth software comparison articles. Check back soon!</p>
          </div>
        )}

        {/* Cross-promo banner */}
        <NativeAdBanner className="mt-8" />
      </motion.div>
    </>
  );
}

export async function getStaticProps() {
  const posts = await getAlternativePosts();
  return {
    props: { posts },
    revalidate: 86400, // 1 day
  };
}
