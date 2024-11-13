import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com", "img.clerk.com"], // Add img.clerk.com here
  },
};

export default nextConfig;
