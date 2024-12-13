/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'tklblvxgprkvletfrsnn.supabase.co'
    ],
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
  // Add compression
  compress: true,
  // Add caching headers
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;