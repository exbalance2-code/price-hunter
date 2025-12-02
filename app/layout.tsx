import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Price Hunter - ผู้ช่วยค้นหาสินค้าราคาถูกจาก Lazada ผ่าน LINE",
  description: "ค้นหาสินค้าจาก Lazada ได้ง่ายๆ ผ่าน LINE Bot เปรียบเทียบราคา คัดเฉพาะร้านน่าเชื่อถือ ส่งผลลัพธ์ภายใน 3 วินาที ใช้งานฟรีตลอดชีพ",
  keywords: ["price hunter", "ค้นหาสินค้า", "lazada", "เปรียบเทียบราคา", "line bot", "ช้อปปิ้งออนไลน์", "ของถูก"],
  authors: [{ name: "Price Hunter Team" }],
  creator: "Price Hunter",
  publisher: "Price Hunter",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "https://price-hunter.vercel.app",
    siteName: "Price Hunter",
    title: "Price Hunter - ผู้ช่วยค้นหาสินค้าราคาถูกจาก Lazada",
    description: "ค้นหาสินค้าจาก Lazada ได้ง่ายๆ ผ่าน LINE Bot เปรียบเทียบราคา คัดเฉพาะร้านน่าเชื่อถือ",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Price Hunter - LINE Bot ค้นหาสินค้าราคาถูก",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Price Hunter - ผู้ช่วยค้นหาสินค้าราคาถูกจาก Lazada",
    description: "ค้นหาสินค้าจาก Lazada ได้ง่ายๆ ผ่าน LINE Bot เปรียบเทียบราคา คัดเฉพาะร้านน่าเชื่อถือ",
    images: ["/og-image.png"],
  },
  verification: {
    google: "your-google-verification-code", // แทนที่ด้วยรหัสจริงจาก Google Search Console
  },
  alternates: {
    canonical: "https://price-hunter.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Price Hunter",
              "description": "ผู้ช่วยค้นหาสินค้าราคาถูกจาก Lazada ผ่าน LINE Bot",
              "url": "https://price-hunter.vercel.app",
              "applicationCategory": "UtilitiesApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "THB"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "150"
              }
            })
          }}
        />
      </head>
      <body className={`${prompt.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}