const withPWA = require('next-pwa')({
  dest: 'public', // destination directory for the PWA files
  disable: process.env.NODE_ENV === 'development', // disable PWA in development mode
  register: true, // register the PWA service worker
  skipWaiting: true, // skip waiting for service worker activation
  runtimeCaching: [
    {
      urlPattern: /^https?:\/\/(?:pagead2\.googlesyndication\.com|googleads\.g\.doubleclick\.net|tpc\.googlesyndication\.com|www\.google\.com\/adsense).*/, 
      handler: 'NetworkOnly',  // Never cache AdSense content
      options: {
        cacheName: 'adsense'
      }
    },
    {
      urlPattern: /^https?.*\.(js|css|woff2?)/, // Static assets
      handler: 'CacheFirst',  // Good for static assets that rarely change
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 50,     // Reduced since blogs typically have fewer static assets
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days is good
        }
      }
    },
    {
      urlPattern: /^https?.*\.(png|jpg|jpeg|svg|gif)/, // Images
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 100,    // Adjusted for typical blog image usage
          maxAgeSeconds: 90 * 24 * 60 * 60 // Extended to 90 days since blog images rarely change
        }
      }
    },
    {
      urlPattern: /^https?:\/\/[^/]+\/api\/.*$/, // API routes
      handler: 'NetworkFirst',  // Changed to NetworkFirst for fresher content
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 12 * 60 * 60 // Reduced to 12 hours for more frequent updates
        }
      }
    },
    {
      urlPattern: /^https?.*/, // Blog posts and other content
      handler: 'NetworkFirst',  // Better for frequently updated content
      options: {
        cacheName: 'content',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours is good for blog content
        }
      }
    },
    {
      urlPattern: /version\.json/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'version-cache',
        expiration: {
          maxAgeSeconds: 0 // Don't cache version.json
        }
      }
    }
  ]
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,            // Enable SWC minification for improved performance
  compiler: {
      removeConsole: process.env.NODE_ENV !== "development"     // Remove console.log in production
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
        { hostname: "media.graphassets.com"},
        { hostname: "cdn.buymeacoffee.com"},
    ],
  },
  experimental: {
    // serviceWorker: true,
    // workerThreads: false,
    cpus: 1,
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'], timeout: 30000 } },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400', // 1 week max-age, 1 day stale-while-revalidate
          },
        ],
      },
    ];
  },
}

module.exports = withPWA(nextConfig)
