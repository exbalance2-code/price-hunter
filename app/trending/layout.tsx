import { Metadata } from 'next'

export const metadata: Metadata = {
    title: '🔥 สินค้ายอดนิยม - Price Hunter',
    description: 'ดูสินค้ายอดนิยมสัปดาห์นี้! เปรียบเทียบราคาจาก Shopee & Lazada ได้ทันที',
    openGraph: {
        title: '🔥 สินค้ายอดนิยม - Price Hunter',
        description: 'ดูสินค้ายอดนิยมสัปดาห์นี้! เปรียบเทียบราคาจาก Shopee & Lazada ได้ทันที',
        url: 'https://price-hunter.vercel.app/trending',
        siteName: 'Price Hunter Bot',
        images: [
            {
                url: 'https://price-hunter.vercel.app/og-image.png',
                width: 1200,
                height: 630,
                alt: 'สินค้ายอดนิยม - Price Hunter',
            },
        ],
        locale: 'th_TH',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: '🔥 สินค้ายอดนิยม - Price Hunter',
        description: 'ดูสินค้ายอดนิยมสัปดาห์นี้! เปรียบเทียบราคาจาก Shopee & Lazada ได้ทันที',
        images: ['https://price-hunter.vercel.app/og-image.png'],
    },
}

export default function TrendingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
