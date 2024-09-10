/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },

  images: {
    remotePatterns: [
        { hostname: "media.graphassets.com"},
    ],
  },
  experimental: {
    workerThreads: false,
    cpus: 1
  },
}

module.exports = nextConfig
