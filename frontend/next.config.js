/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,

  images: {
    domains: ["storage.googleapis.com", ""]
  },
  typescript: {

    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
