import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dvvjkgh94f2v6.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
