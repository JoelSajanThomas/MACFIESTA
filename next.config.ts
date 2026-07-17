import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "macfiesta.macfast.org",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  allowedDevOrigins: ["192.168.0.100"],
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: false,
    serverActions: {
      allowedOrigins: ["192.168.0.100:3000", "localhost:3000"],
    },
  },
};

export default nextConfig;
