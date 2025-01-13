const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    dynamicIO: true,
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
