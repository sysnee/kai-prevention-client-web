/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d2343lbggy2b29.cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3-sa-east-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "kai-ris-files.s3.us-east-1.amazonaws.com",
        pathname: "/**",
      }
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ]
      }
    ]
  },
  experimental: {
    outputFileTracingRoot: undefined // Fixes the -o error in some cases
  }
};

export default nextConfig;
