import Script from 'next/script';

/**
 * Reusable SEO Schema component for injecting JSON-LD structured data.
 * Supports: WebApplication, HowTo, Product, ItemList, BreadcrumbList, Article
 */
const SeoSchema = ({ id, schema }) => {
  if (!schema) return null;
  
  return (
    <Script id={id} type="application/ld+json">
      {JSON.stringify(schema)}
    </Script>
  );
};

/**
 * Generate a HowTo schema for guide pages.
 * This is the key schema for capturing Google "How-To" rich snippets.
 */
export function buildHowToSchema({ title, description, steps, totalTime, url, image }) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "description": description,
    "totalTime": totalTime || "PT10M",
    "url": url,
    ...(image && { "image": image }),
    "step": (steps || []).map((step, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": step.title || `Step ${i + 1}`,
      "text": step.content || step.text || '',
      ...(step.image && { "image": step.image }),
      ...(step.url && { "url": step.url }),
    })),
  };
}

/**
 * Generate an ItemList schema for alternative comparison pages.
 * Triggers Google "Listicle" rich snippets.
 */
export function buildItemListSchema({ title, description, items, url }) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": title,
    "description": description,
    "url": url,
    "numberOfItems": items.length,
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "description": item.description || '',
      ...(item.url && { "url": item.url }),
    })),
  };
}

/**
 * Generate a WebApplication schema for tool pages.
 */
export function buildWebAppSchema({ name, description, url }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "description": description,
    "url": url,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "publisher": {
      "@type": "Organization",
      "name": "ProgrmrsLife",
      "url": "https://www.progrmrslife.com",
    },
  };
}

/**
 * Generate a BreadcrumbList schema.
 */
export function buildBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}

/**
 * Generate an Article schema for blog/guide posts.
 */
export function buildArticleSchema({ title, description, url, image, datePublished, dateModified, authorName }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": url,
    ...(image && { "image": image }),
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Person",
      "name": authorName || "Ibrahim Ben Salah",
    },
    "publisher": {
      "@type": "Organization",
      "name": "ProgrmrsLife",
      "url": "https://www.progrmrslife.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.progrmrslife.com/icons/icon-512x512.png",
      },
    },
  };
}

export default SeoSchema;
