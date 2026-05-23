/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            // Prevent clickjacking
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            // Prevent MIME sniffing
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            // Control referrer info
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
            // Restrict browser features
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=()',
            },
            // Content Security Policy
            {
              key: 'Content-Security-Policy',
              value: [
                "default-src 'self'",
                "style-src 'self' 'unsafe-inline'",
                // fonts served from self via next/font
                "font-src 'self'",
                // gold API call
                "connect-src 'self' https://api.gold-api.com",
                "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
                "img-src 'self' data:",
                "frame-ancestors 'none'",
              ].join('; '),
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;