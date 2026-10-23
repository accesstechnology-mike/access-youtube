const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    // "use cache" from the canary. Stable 15.5 supports this flag.
    // experimental.dynamicIO is not set: 15.5 renames it to cacheComponents
    // and then rejects it on stable builds. Next.js 16's cacheComponents
    // replacement hangs page renders on Cloudflare Workers.
    useCache: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.join(__dirname, "app"),
    };
    return config;
  },
};

module.exports = nextConfig;
