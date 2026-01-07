import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

module.exports = nextConfig;
