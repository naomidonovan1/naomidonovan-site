/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,               // avoid SWC minifier edge-case
  reactStrictMode: true,
  experimental: {
    webpackBuildWorker: false,    // avoid worker path that can trigger this
  },
};
module.exports = nextConfig;
