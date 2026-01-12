import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // you can keep this true (no optimizer)
    unoptimized: true,

    domains: ['health-sight.s3.ap-southeast-2.amazonaws.com'],

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'health-sight.s3.ap-southeast-2.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
