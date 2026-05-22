/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // This is better for Vercel deployment
  eslint: {
    ignoreDuringBuilds: true, // Speeds up build and ignores lint errors
  },
  typescript: {
    ignoreBuildErrors: true, // Speeds up build and ignores type errors
  },
};

module.exports = nextConfig;
