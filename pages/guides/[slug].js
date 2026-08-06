import React, { useMemo } from 'react';
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
import RichTextContent from '../../components/shared/RichTextContent';
import PostActions from '../../components/shared/PostActions';
import { formatDate } from '../../lib/formatDate';

/** Auto-calculate reading time from text content */
export function getReadingTime(text) {
  if (!text) return null;
  const words = text.replace(/(<[^>]+>|\{[^}]*\}|\[[^\]]*\])/g, '').split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

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
  const readingTime = useMemo(
    () => getReadingTime(guide.content?.text),
    [guide]
  );
  const publishDate = formatDate(guide.createdAt);

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
            "totalTime": readingTime ? `PT${parseInt(readingTime)}M` : "PT10M",
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

        {/* Featured Image */}
        {guide.featuredImage?.url && (
          <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden mb-8 shadow-lg">
            <Image
              src={guide.featuredImage.url}
              alt={guide.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Hero */}
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {guide.framework && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                {guide.framework}
              </span>
            )}
            <DifficultyBadge difficulty={guide.difficulty} />
            {guide.categories?.map((cat) => (
              <span key={cat.slug} className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                {cat.name}
              </span>
            ))}
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
                  <Image fill src={guide.author.photo.url} alt={guide.author.name} className="rounded-full object-cover" />
                </div>
              )}
              <div className="text-sm">
                <span className="font-medium text-gray-900 dark:text-white">{guide.author.name}</span>
                <span className="text-gray-400 mx-2">·</span>
                <time className="text-gray-500">{publishDate}</time>
              </div>
            </div>
          )}
        </div>

        {/* Post Actions — Share, Copy Link, Listen */}
        <PostActions
          title={guide.title}
          slug={guide.slug}
          basePath="/guides"
          plainText={guide.content?.text}
          readingTime={readingTime}
        />

        {/* Top Ad */}
        <div className="mb-6">
          <AdsenseScript />
          <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-5021308603136043" data-ad-slot="3167248456" data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        {/* Steps Overview (quick summary) */}
        {steps.length > 0 && (
          <div className="mb-8 tool-glass p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
              📋 What You&#39;ll Learn ({steps.length} step{steps.length !== 1 ? 's' : ''})
            </h2>
            <ol className="space-y-1.5">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span>{step.stepTitle || step.title || `Step ${i + 1}`}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Main Content (RichText — same renderer as PostDetail) */}
        <RichTextContent content={guide.content} />

        {/* Mid-article Ad (code-adjacent style) */}
        <CodeBlockAd />

        {/* Steps - Detailed Walkthrough */}
        {steps.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm">📝</span>
              Step-by-Step Walkthrough
            </h2>
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

        {/* Bottom Actions (repeat for long articles) */}
        <PostActions
          title={guide.title}
          slug={guide.slug}
          basePath="/guides"
          plainText={guide.content?.text}
          readingTime={readingTime}
        />

        {/* Back Link */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
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
