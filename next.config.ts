/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,                 // avoids the SWC edge-case you hit
  reactStrictMode: true,
  experimental: { webpackBuildWorker: false },
};
module.exports = nextConfig;