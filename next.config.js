/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "jb-api.rezarizqi.my.id",
      "api.letsworkanywhere.com",
    ],
  },
};

module.exports = nextConfig;
