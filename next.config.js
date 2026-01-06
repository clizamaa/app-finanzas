/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          }
        ]
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap'
      }
    ]
  },
  images: {
    domains: ['localhost', 'appfinanzashoy.com', 'res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  poweredByHeader: false,
  generateEtags: true,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react']
  },
  env: {
    SITE_URL: process.env.SITE_URL,
    SITE_NAME: process.env.SITE_NAME
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('_http_common')
    }
    return config
  }
}

module.exports = nextConfig
