import React from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getAlternativePostDetails, getAlternativePostSlugs } from '../../services/alternatives';
import ComparisonTable from '../../components/alternatives/ComparisonTable';
import AlternativeCard from '../../components/alternatives/AlternativeCard';
import { AdsenseScript } from '../../components';
import Image from 'next/image';

export default function AlternativePostPage({ post }) {
  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post Not Found</h1>
        <Link href="/alternatives" className="text-violet-600 hover:text-violet-700">
          ← Back to Alternatives
        </Link>
      </div>
    );
  }

  const alternatives = Array.isArray(post.alternatives) ? post.alternatives : [];
  const canonicalUrl = `https://www.progrmrslife.com/alternatives/${post.slug}`;

  return (
    <>
      <Head>
        <title>{post.title} | ProgrmrsLife</title>
        <meta name="description" content={post.excerpt} />
        {post.seoKeywords && <meta name="keywords" content={post.seoKeywords} />}
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        {post.featuredImage?.url && <meta property="og:image" content={post.featuredImage.url} />}
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      {/* ItemList Schema */}
      <Script id="alt-itemlist" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": post.title,
          "description": post.excerpt,
          "url": canonicalUrl,
          "numberOfItems": alternatives.length,
          "itemListElement": alternatives.map((alt, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": alt.name,
            "description": alt.description || '',
            ...(alt.url && { "url": alt.url }),
          })),
        })}
      </Script>

      {/* Breadcrumb Schema */}
      <Script id="alt-breadcrumb" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.progrmrslife.com" },
            { "@type": "ListItem", "position": 2, "name": "Alternatives", "item": "https://www.progrmrslife.com/alternatives" },
            { "@type": "ListItem", "position": 3, "name": post.title, "item": canonicalUrl },
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
          <Link href="/alternatives" className="hover:text-violet-600 transition-colors">Alternatives</Link>
          <ChevronRight />
          <span className="text-gray-900 dark:text-white font-semibold truncate max-w-[300px]">{post.title}</span>
        </nav>

        {/* Top Ad */}
        <div className="mb-6">
          <AdsenseScript />
          <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-5021308603136043" data-ad-slot="3167248456" data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {post.targetSoftwareLogo?.url && (
              <div className='relative flex-none w-16 h-16'>
                <Image fill src={post.targetSoftwareLogo.url} alt={post.targetSoftware} className="w-16 h-16 rounded-xl object-contain shadow-md" />
              </div>
            )}
            <div>
              {post.categories?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-1">
                  {post.categories.map((cat) => (
                    <span key={cat.slug} className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">{post.title}</h1>
            </div>
          </div>

          {post.excerpt && (
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{post.excerpt}</p>
          )}

          {/* Author & Date */}
          {post.author && (
            <div className="flex items-center gap-3 mt-4">
              {post.author.photo?.url && (
                <div className='relative flex-none w-8 h-8'>
                  <Image fill src={post.author.photo.url} alt={post.author.name} className="w-8 h-8 rounded-full" />
                </div>
              )}
              <div className="text-sm">
                <span className="font-medium text-gray-900 dark:text-white">{post.author.name}</span>
                <span className="text-gray-400 mx-2">·</span>
                <time className="text-gray-500">{new Date(post.updatedAt || post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              </div>
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {alternatives.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Comparison</h2>
            <ComparisonTable alternatives={alternatives} targetSoftware={post.targetSoftware} />
          </div>
        )}

        {/* Main Content */}
        {post.content?.html && (
          <div
            className="prose dark:prose-invert max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.content.html }}
          />
        )}

        {/* Mid-article Ad */}
        <div className="my-8">
          <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-5021308603136043" data-ad-slot="3167248456" data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        {/* Alternative Cards */}
        {alternatives.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Detailed Breakdown</h2>
            <div className="space-y-6">
              {alternatives.map((alt, i) => (
                <AlternativeCard key={i} alternative={alt} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Bottom Ad */}
        <div className="mt-8">
          <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-5021308603136043" data-ad-slot="3167248456" data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link href="/alternatives" className="text-violet-600 dark:text-violet-400 hover:underline font-medium">
            ← Browse All Alternatives
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
  const slugs = await getAlternativePostSlugs();
  return {
    paths: slugs.map(({ slug }) => ({ params: { slug } })),
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const post = await getAlternativePostDetails(params.slug);
  if (!post) return { notFound: true };
  return {
    props: { post },
    revalidate: 86400,
  };
}
