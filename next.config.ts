import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      // If your backend or storage is on a different domain, add another object here:
      // {
      //   protocol: 'https',
      //   hostname: 'api.yourdomain.com',
      //   pathname: '/**',
      // },
    ],
  },
};

export default nextConfig;