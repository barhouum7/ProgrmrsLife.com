import React from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getGuideDetails, getGuideSlugs } from '../../services/guides';
import StepCard from '../../components/guides/StepCard';
import DifficultyBadge from '../../components/guides/DifficultyBadge';
import { AdsenseScript } from '../../components';
import Image from 'next/image';
import CodeBlockAd from '../../components/ads/CodeBlockAd';
import NativeAdBanner from '../../components/ads/NativeAdBanner';

export default function GuideDetailPage({ guide }) {
  if (!guide) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Guide Not Found</h1>
        <Link href="/guides" className="text-violet-600 hover:text-violet-700">
          ← Back to Guides
        </Link>
      </div>
    );
  }

  const steps = Array.isArray(guide.steps) ? guide.steps : [];
  const canonicalUrl = `https://www.progrmrslife.com/guides/${guide.slug}`;

  return (
    <>
      <Head>
        <title>{guide.title} | ProgrmrsLife Guides</title>
        <meta name="description" content={guide.excerpt} />
        {guide.seoKeywords && <meta name="keywords" content={guide.seoKeywords} />}
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={guide.title} />
        <meta property="og:description" content={guide.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        {guide.featuredImage?.url && <meta property="og:image" content={guide.featuredImage.url} />}
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      {/* HowTo Schema — the key for Google Rich Snippets */}
      {steps.length > 0 && (
        <Script id="howto-schema" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": guide.title,
            "description": guide.excerpt,
            "totalTime": guide.estimatedTime ? `PT${parseInt(guide.estimatedTime)}M` : "PT10M",
            "url": canonicalUrl,
            ...(guide.featuredImage?.url && { "image": guide.featuredImage.url }),
            "step": steps.map((step, i) => ({
              "@type": "HowToStep",
              "position": i + 1,
              "name": step.stepTitle || step.title || `Step ${i + 1}`,
              "text": step.stepContent || step.content || '',
            })),
          })}
        </Script>
      )}

      {/* Article Schema */}
      <Script id="guide-article-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TechArticle",
          "headline": guide.title,
          "description": guide.excerpt,
          "url": canonicalUrl,
          "datePublished": guide.createdAt,
          "dateModified": guide.updatedAt || guide.createdAt,
          ...(guide.featuredImage?.url && { "image": guide.featuredImage.url }),
          "author": {
            "@type": "Person",
            "name": guide.author?.name || "ProgrmrsLife",
          },
          "publisher": {
            "@type": "Organization",
            "name": "ProgrmrsLife",
            "url": "https://www.progrmrslife.com",
          },
          "proficiencyLevel": guide.difficulty || "Beginner",
        })}
      </Script>

      {/* Breadcrumb Schema */}
      <Script id="guide-breadcrumb" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.progrmrslife.com" },
            { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://www.progrmrslife.com/guides" },
            { "@type": "ListItem", "position": 3, "name": guide.title, "item": canonicalUrl },
          ]
        })}
      </Script>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-violet-600 transition-colors">Home</Link>
          <ChevronRight />
          <Link href="/guides" className="hover:text-violet-600 transition-colors">Guides</Link>
          <ChevronRight />
          <span className="text-gray-900 dark:text-white font-semibold truncate max-w-[300px]">{guide.title}</span>
        </nav>

        {/* Top Ad */}
        <div className="mb-6">
          <AdsenseScript />
          <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-5021308603136043" data-ad-slot="3167248456" data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        {/* Hero */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {guide.framework && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                {guide.framework}
              </span>
            )}
            <DifficultyBadge difficulty={guide.difficulty} />
            {guide.estimatedTime && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                ⏱️ {guide.estimatedTime}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
            {guide.title}
          </h1>

          {guide.excerpt && (
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{guide.excerpt}</p>
          )}

          {/* Author & Date */}
          {guide.author && (
            <div className="flex items-center gap-3 mt-4">
              {guide.author.photo?.url && (
                <div className='relative flex-none w-8 h-8'>
                  <Image fill src={guide.author.photo.url} alt={guide.author.name} className="w-8 h-8 rounded-full" />
                </div>
              )}
              <div className="text-sm">
                <span className="font-medium text-gray-900 dark:text-white">{guide.author.name}</span>
                <span className="text-gray-400 mx-2">·</span>
                <time className="text-gray-500">{new Date(guide.updatedAt || guide.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              </div>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        {steps.length > 0 && (
          <div className="mb-6 tool-glass p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">{steps.length}</span>
              <span>step{steps.length !== 1 ? 's' : ''}</span>
              {guide.estimatedTime && (
                <>
                  <span className="text-gray-300 dark:text-gray-600 mx-1">·</span>
                  <span>{guide.estimatedTime} estimated</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Main Content (Rich Text) */}
        {guide.content?.html && (
          <div
            className="prose dark:prose-invert max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: guide.content.html }}
          />
        )}

        {/* Mid-article Ad (code-adjacent style) */}
        <CodeBlockAd />

        {/* Steps */}
        {steps.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Step-by-Step Guide</h2>
            <div>
              {steps.map((step, i) => (
                <StepCard key={i} step={step} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Bottom Ad */}
        <div className="mt-8">
          <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-5021308603136043" data-ad-slot="3167248456" data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        {/* Cross-promo banner */}
        <NativeAdBanner className="mt-6" />

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link href="/guides" className="text-violet-600 dark:text-violet-400 hover:underline font-medium">
            ← Browse All Guides
          </Link>
        </div>
      </motion.div>
    </>
  );
}

function ChevronRight() {
  return (
    <svg className="w-4 h-4 mx-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export async function getStaticPaths() {
  const slugs = await getGuideSlugs();
  return {
    paths: slugs.map(({ slug }) => ({ params: { slug } })),
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const guide = await getGuideDetails(params.slug);
  if (!guide) return { notFound: true };
  return {
    props: { guide },
    revalidate: 86400,
  };
}
