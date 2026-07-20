/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/blog': ['./content/posts/**/*'],
    '/blog/*': ['./content/posts/**/*'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://api.fontshare.com https://fonts.cdnfonts.com https://fonts.googleapis.com; font-src 'self' https://api.fontshare.com https://fonts.cdnfonts.com https://fonts.gstatic.com https://cdn.fontshare.com https://fonts.cdnfonts.com; img-src 'self' data:; connect-src 'self' https://formspree.io; frame-ancestors 'none';" },
        ],
      },
    ]
  },
}

export default nextConfig
