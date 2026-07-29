import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';
import { motion } from 'framer-motion';
import { getGuides } from '../../services/guides';
import DifficultyBadge from '../../components/guides/DifficultyBadge';
import FrameworkFilter from '../../components/guides/FrameworkFilter';
import { AdsenseScript } from '../../components';
import NativeAdBanner from '../../components/ads/NativeAdBanner';
import { getReadingTime } from './[slug]';

export default function GuidesHub({ guides }) {
  const [activeFramework, setActiveFramework] = useState('all');

  const filteredGuides = useMemo(() => {
    if (activeFramework === 'all') return guides;
    return guides.filter((g) => g.framework === activeFramework);
  }, [guides, activeFramework]);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Head>
        <title>Developer Guides — How-To Articles & Code Fixes | ProgrmrsLife</title>
        <meta name="description" content="Step-by-step developer guides: fix CORS errors, setup Next.js, configure Docker, and more. Targeted code snippets that solve real problems." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Developer Guides — ProgrmrsLife" />
        <meta property="og:description" content="Step-by-step developer guides and how-to code fix articles." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.progrmrslife.com/guides" />
        <link rel="canonical" href="https://www.progrmrslife.com/guides" />
      </Head>

      <Script id="guides-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Developer Guides",
          "description": "Step-by-step developer guides, how-to articles, and code snippets.",
          "url": "https://www.progrmrslife.com/guides",
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
                        bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span>📖</span>
            <span>Targeted Code Fixes & Tutorials</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            <span className="text-gray-900 dark:text-white">Developer </span>
            <span className="tool-gradient-text">Guides</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Short, focused how-to articles that solve real developer problems.
            Copy-paste ready code snippets with step-by-step explanations.
          </p>
        </motion.div>

        {/* Framework Filter */}
        <div className="mb-8">
          <FrameworkFilter active={activeFramework} onChange={setActiveFramework} />
        </div>

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

        {/* Guides Grid */}
        {filteredGuides && filteredGuides.length > 0 ? (
          <div className="tools-grid">
            {filteredGuides.map((guide, index) => (
              <motion.div
                key={guide.slug}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <Link href={`/guides/${guide.slug}`} className="block h-full">
                  <div className="tool-card tool-glass h-full">
                    {/* Framework + Difficulty */}
                    <div className="flex items-center justify-between mb-3">
                      {guide.framework && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          {guide.framework}
                        </span>
                      )}
                      <DifficultyBadge difficulty={guide.difficulty} />
                    </div>

                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {guide.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3">
                      {guide.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                      {guide.content?.text && (
                        <span>⏱️ {getReadingTime(guide.content?.text)}</span>
                      )}
                      <span className="flex items-center gap-1 font-semibold text-violet-600 dark:text-violet-400">
                        Read Guide →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">📖</span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {activeFramework !== 'all' ? `No ${activeFramework} Guides Yet` : 'Coming Soon'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {activeFramework !== 'all'
                ? 'Try selecting a different framework or check back soon!'
                : 'We\'re preparing step-by-step developer guides. Check back soon!'}
            </p>
          </div>
        )}

        {/* Cross-promo banner */}
        <NativeAdBanner className="mt-8" />
      </motion.div>
    </>
  );
}

export async function getStaticProps() {
  const guides = await getGuides();
  return {
    props: { guides },
    revalidate: 86400,
  };
}
