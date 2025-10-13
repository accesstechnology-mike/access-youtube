const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'export', // Enable static export
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
  experimental: {
    dynamicIO: true,
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
