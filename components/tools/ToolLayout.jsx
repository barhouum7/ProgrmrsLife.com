import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import { motion } from 'framer-motion';
import { TOOLS, getToolBySlug } from '../../data/tools';
import { AdsenseScript } from '../../components';
import StickyAd from '../ads/StickyAd';
import NativeAdBanner from '../ads/NativeAdBanner';

/**
 * Shared layout wrapper for all individual tool pages.
 * Provides: SEO head, breadcrumbs, sidebar nav, ad slots, back-to-tools.
 */
const ToolLayout = ({ children, toolSlug, title, description, schemaMarkup }) => {
  const router = useRouter();
  const currentTool = getToolBySlug(toolSlug);

  const pageTitle = title || (currentTool ? `${currentTool.name} — Free Online Dev Tool | ProgrmrsLife` : 'Dev Tools | ProgrmrsLife');
  const pageDescription = description || (currentTool ? currentTool.description : 'Free online developer tools for formatting, encoding, testing, and more.');
  const canonicalUrl = `https://www.progrmrslife.com${router.asPath}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={currentTool ? currentTool.keywords.join(', ') + ', free online tool, developer tool, progrmrslife' : 'developer tools, free online tools, progrmrslife'} />
        <meta name="author" content="ProgrmrsLife" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://www.progrmrslife.com/icons/icon-512x512.png" />
        <meta property="og:site_name" content="ProgrmrsLife" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://www.progrmrslife.com/icons/icon-512x512.png" />

        <link rel="icon" href="/icons/favicon.svg" />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      {/* JSON-LD Schema */}
      {schemaMarkup && (
        <Script id={`schema-${toolSlug || 'tools'}`} type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </Script>
      )}

      {/* Breadcrumb Schema */}
      <Script id="breadcrumb-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.progrmrslife.com" },
            { "@type": "ListItem", "position": 2, "name": "Dev Tools", "item": "https://www.progrmrslife.com/tools" },
            ...(currentTool ? [{
              "@type": "ListItem",
              "position": 3,
              "name": currentTool.name,
              "item": `https://www.progrmrslife.com/tools/${currentTool.slug}`
            }] : []),
          ]
        })}
      </Script>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
            Home
          </Link>
          <ChevronRight />
          <Link href="/tools" className={`hover:text-violet-600 dark:hover:text-violet-400 transition-colors ${!currentTool ? 'text-gray-900 dark:text-white font-semibold' : ''}`}>
            Dev Tools
          </Link>
          {currentTool && (
            <>
              <ChevronRight />
              <span className="text-gray-900 dark:text-white font-semibold truncate max-w-[200px]">
                {currentTool.name}
              </span>
            </>
          )}
        </nav>

        {/* Top Ad Slot */}
        <div className="mb-6">
          <AdsenseScript />
          <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-5021308603136043"
            data-ad-slot="3167248456"
            data-ad-format="auto"
            data-full-width-responsive="true" />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <motion.div
            className="lg:col-span-8 col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}

            {/* Native cross-promo banner below tool content */}
            <NativeAdBanner className="mt-6" />
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="lg:col-span-4 col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Sidebar Ad */}
              <StickyAd className="mb-4" />

              {/* All Tools Navigation */}
              <div className="tool-glass p-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>🛠️</span> All Tools
                </h3>
                <div className="flex flex-col gap-0.5">
                  {TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className={`tool-sidebar-link ${toolSlug === tool.slug ? 'active' : ''}`}
                    >
                      <span className="text-base flex-shrink-0 w-6 text-center">{tool.icon}</span>
                      <span className="truncate">{tool.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Bottom Sidebar Ad */}
              <StickyAd />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

function ChevronRight() {
  return (
    <svg className="w-4 h-4 mx-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default ToolLayout;
