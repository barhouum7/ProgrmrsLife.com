import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';
import { motion } from 'framer-motion';
import { TOOLS, TOOL_CATEGORIES, getToolsByCategory } from '../../data/tools';
import { AdsenseScript } from '../../components';
import NativeAdBanner from '../../components/ads/NativeAdBanner';

export default function ToolsHub() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  return (
    <>
      <Head>
        <title>Free Dev Tools — JSON Formatter, Base64, Regex, Hash & More | ProgrmrsLife</title>
        <meta name="description" content="Free online developer tools: JSON Formatter, Base64 Encoder, Regex Tester, JWT Decoder, Hash Generator, Color Converter, Diff Checker, and more. No signup required." />
        <meta name="keywords" content="free developer tools, json formatter, base64 encoder, regex tester, jwt decoder, hash generator, css minifier, color converter, markdown preview, url encoder, diff checker, online tools" />
        <meta name="author" content="ProgrmrsLife" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />

        <meta property="og:title" content="Free Dev Tools — ProgrmrsLife" />
        <meta property="og:description" content="Free online developer tools: JSON Formatter, Base64 Encoder, Regex Tester, JWT Decoder, and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.progrmrslife.com/tools" />
        <meta property="og:image" content="https://www.progrmrslife.com/icons/icon-512x512.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Dev Tools — ProgrmrsLife" />
        <meta name="twitter:description" content="Free online developer tools: JSON Formatter, Base64 Encoder, Regex Tester, JWT Decoder, and more." />

        <link rel="icon" href="/icons/favicon.svg" />
        <link rel="canonical" href="https://www.progrmrslife.com/tools" />
      </Head>

      {/* Schema Markup */}
      <Script id="tools-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Free Developer Tools",
          "description": "A collection of free online developer tools for formatting, encoding, testing, and more.",
          "url": "https://www.progrmrslife.com/tools",
          "publisher": {
            "@type": "Organization",
            "name": "ProgrmrsLife",
            "url": "https://www.progrmrslife.com"
          },
          "hasPart": TOOLS.map((tool) => ({
            "@type": "WebApplication",
            "name": tool.name,
            "description": tool.description,
            "url": `https://www.progrmrslife.com/tools/${tool.slug}`,
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Any",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
          }))
        })}
      </Script>

      <Script id="breadcrumb-tools" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.progrmrslife.com" },
            { "@type": "ListItem", "position": 2, "name": "Dev Tools", "item": "https://www.progrmrslife.com/tools" },
          ]
        })}
      </Script>

      <motion.div
        initial="initial"
        animate="animate"
        variants={{ initial: { opacity: 0 }, animate: { opacity: 1 } }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4
                        bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span>🛠️</span>
            <span>100% Free — No Signup Required</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            <span className="text-gray-900 dark:text-white">Developer </span>
            <span className="tool-gradient-text">Toolkit</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Lightning-fast, privacy-friendly dev tools that run entirely in your browser. 
            No data leaves your machine.
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

        {/* Tools by Category */}
        {TOOL_CATEGORIES.map((category) => {
          const categoryTools = getToolsByCategory(category.id);
          if (categoryTools.length === 0) return null;

          return (
            <motion.section
              key={category.id}
              className="mb-12"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">{category.emoji}</span>
                {category.label}
              </h2>

              <motion.div className="tools-grid" variants={stagger}>
                {categoryTools.map((tool, index) => (
                  <motion.div
                    key={tool.slug}
                    variants={fadeInUp}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                  >
                    <Link href={`/tools/${tool.slug}`} className="block h-full">
                      <div className="tool-card tool-glass h-full">
                        {/* Icon */}
                        <div className={`tool-card-icon ${tool.bgColor}`}>
                          <span className="text-xl">{tool.icon}</span>
                        </div>

                        {/* Name */}
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                          {tool.name}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                          {tool.description}
                        </p>

                        {/* CTA with arrow */}
                        <div className="flex items-center gap-1 text-sm font-semibold text-violet-600 dark:text-violet-400">
                          <span>Open Tool</span>
                          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
          );
        })}

        {/* Cross-promo banner */}
        <NativeAdBanner className="mt-4 mb-8" />

        {/* Bottom Ad Slot */}
        <div className="mt-8">
          <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-5021308603136043"
            data-ad-slot="3167248456"
            data-ad-format="auto"
            data-full-width-responsive="true" />
        </div>
      </motion.div>
    </>
  );
}
