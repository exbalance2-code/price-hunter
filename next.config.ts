import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 👇 เพิ่มส่วนนี้เข้าไปครับ เพื่อบอกว่าไลบรารีพวกนี้ไม่ต้อง Compile
  serverExternalPackages: [
    'puppeteer',
    'puppeteer-extra',
    'puppeteer-extra-plugin-stealth'
  ],

  // Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;