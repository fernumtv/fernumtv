import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.calendly.com https://plausible.io; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob: https://*.supabase.co; media-src 'self' https: blob:; connect-src 'self' https://calendly.com https://*.calendly.com https://plausible.io https://test.dodopayments.com https://app.dodopayments.com https://*.supabase.co; frame-src 'self' https://calendly.com https://*.calendly.com https://test.dodopayments.com https://app.dodopayments.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
