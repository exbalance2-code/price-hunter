import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 👇 เพิ่มส่วนนี้เข้าไปครับ เพื่อบอกว่าไลบรารีพวกนี้ไม่ต้อง Compile
  serverExternalPackages: [
    'puppeteer',
    'puppeteer-extra', 
    'puppeteer-extra-plugin-stealth'
  ],
};

export default nextConfig;