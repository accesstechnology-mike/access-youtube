/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // experimental.dynamicIO was renamed to cacheComponents in Next.js 16.
  // This app predates Partial Prefetching, so keep the older cache behavior.
  // The @ alias lives in jsconfig/tsconfig paths, which Turbopack reads.
  cacheComponents: true,
  partialPrefetching: false,
};

module.exports = nextConfig;
