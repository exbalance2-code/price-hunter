import { NextResponse } from 'next/server';
import { Client, WebhookEvent, FlexBubble } from '@line/bot-sdk';
// import { searchProducts } from '@/lib/scraper';
import { searchLazadaProducts } from '@/lib/lazada-client';
import { searchShopeeProducts } from '@/lib/shopee-client';
import { convertToAffiliateLink } from '@/lib/affiliate';
import { logSearch, logClick } from '@/lib/analytics';

// Prevent build-time errors by lazy-loading the client
export const runtime = 'nodejs';

import { query } from '@/lib/db';
import { decrypt } from '@/lib/encryption';

async function getLineClient() {
    // 1. ลองดึงจาก DB
    let token = '';
    let secret = '';

    try {
        const settings = await query<any[]>('SELECT setting_key, setting_value, is_encrypted FROM system_settings WHERE setting_key IN (?, ?)', ['line_channel_access_token', 'line_channel_secret']);

        for (const s of settings) {
            const val = s.is_encrypted ? decrypt(s.setting_value) : s.setting_value;
            if (s.setting_key === 'line_channel_access_token') token = val;
            if (s.setting_key === 'line_channel_secret') secret = val;
        }
    } catch (e) {
        console.warn('Failed to fetch LINE settings from DB, using .env');
    }

    // 2. Fallback ไปที่ .env
    const lineConfig = {
        channelAccessToken: token || process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
        channelSecret: secret || process.env.LINE_CHANNEL_SECRET || '',
    };

    if (!lineConfig.channelAccessToken) {
        throw new Error('no channel access token');
    }

    return new Client(lineConfig);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const events: WebhookEvent[] = body.events || [];

        // Handle Webhook Verification (Empty events)
        if (events.length === 0) {
            return NextResponse.json({ success: true });
        }

        const client = await getLineClient();

        for (const event of events) {
            if (event.type === 'message' && event.message.type === 'text') {
                const userMessage = event.message.text.trim();
                const userId = event.source.userId;

                // 1. ตอบกลับทันทีว่ากำลังค้นหา
                if (event.replyToken && event.replyToken !== '00000000000000000000000000000000') {
                    await client.replyMessage(event.replyToken, {
                        type: 'text',
                        text: `🔍 รอสักครู่กำลังค้นหาสินค้า "${userMessage}"`
                    });
                }

                // 2. ทำงานเบื้องหลัง (Search Process)
                let shopeeProducts: any[] = [];
                let lazadaProducts: any[] = [];

                try {
                    console.log('Searching via Shopee & Lazada APIs...');

                    // Run searches in parallel
                    const [shopeeItems, lazadaItems] = await Promise.all([
                        searchShopeeProducts(userMessage, 5),
                        searchLazadaProducts(userMessage, 5)
                    ]);

                    // Format Shopee
                    shopeeProducts = shopeeItems.map(p => ({
                        title: p.name,
                        price: p.price,
                        image: p.imageUrl,
                        link: p.productLink,
                        sold: p.sold || 0,
                        platform: 'shopee'
                    }));

                    // Format Lazada
                    lazadaProducts = lazadaItems.map(p => ({
                        title: p.name,
                        price: p.price,
                        image: p.imageUrl,
                        link: p.productLink,
                        sold: p.sold || 0,
                        platform: 'lazada'
                    }));

                } catch (e: any) {
                    console.error('API Search Failed:', e.message);
                }

                // Combine results (Interleaved: 1 Shopee, 1 Lazada, ...)
                const bestProducts: any[] = [];
                const maxLen = Math.max(shopeeProducts.length, lazadaProducts.length);

                for (let i = 0; i < maxLen; i++) {
                    if (i < shopeeProducts.length) bestProducts.push(shopeeProducts[i]);
                    if (i < lazadaProducts.length) bestProducts.push(lazadaProducts[i]);
                }

                // Limit to 10
                if (bestProducts.length > 10) {
                    bestProducts.length = 10;
                }

                // Log search analytics
                await logSearch(userMessage, bestProducts.length);

                if (userId) {
                    if (bestProducts.length > 0) {
                        // ไม่ต้องแปลง Affiliate ตรงนี้ และไม่ต้อง Log Click ตรงนี้แล้ว
                        // เราจะสร้าง Tracking URL แทน

                        // หา Base URL (ควรมาจาก ENV เพื่อความถูกต้องเมื่ออยู่บน Production)
                        // แต่ถ้าไม่มีลองเดาจาก Host header (อาจจะไม่เวิร์คถ้าผ่าน proxy/ngrok แบบไม่ forward host)
                        let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
                        if (!baseUrl) {
                            // Fallback for dev (ngrok) - User need to set this!
                            baseUrl = 'http://localhost:3000';
                            console.warn('⚠️ No NEXT_PUBLIC_BASE_URL set. Using localhost. Clicks might fail outside local.');
                        }
                        // แต่เดี๋ยวก่อน! ถ้าใช้ ngrok คุณต้องแก้ baseUrl เป็น https://...ngrok... ด้วย
                        // ไม่งั้น User กด link แล้วจะเข้า localhost ไม่ได้ (ถ้ากดจากมือถือ)

                        const productsWithTracking = bestProducts.map((p: any) => {
                            // original link
                            const originalLink = p.link;

                            // สร้าง Tracking URL
                            // format: /api/click?url=...&title=...&price=...&query=...
                            const params = new URLSearchParams({
                                url: originalLink,
                                title: (p.title || '').substring(0, 50), // Truncate to avoid URL overflow (LINE limit 1000 chars)
                                price: (p.price || 0).toString(),
                                query: userMessage
                            });

                            // ถ้า baseUrl มี https://... แล้วก็ต่อได้เลย
                            // กรณีไม่ได้ set เราจะลองใช้ path relative ไม่ได้เพราะ LINE ต้องการ Full URL
                            // ดังนั้น *จำเป็น* ต้องมี Base URL ที่ถูกต้อง
                            const trackingLink = `${baseUrl}/api/click?${params.toString()}`;

                            return { ...p, link: trackingLink };
                        });

                        await client.pushMessage(userId, {
                            type: 'flex',
                            altText: `ผลการค้นหา: ${userMessage}`,
                            contents: {
                                type: 'carousel',
                                contents: productsWithTracking.map((p: any) => createBubble(p))
                            }
                        });
                    } else {
                        await client.pushMessage(userId, {
                            type: 'text',
                            text: 'ไม่พบสินค้าเลยครับ ลองค้นหาอีกครั้ง'
                        });
                    }
                }
            }
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Webhook Error:", error);
        if (error.response?.data) {
            console.error("LINE API Error Details:", JSON.stringify(error.response.data, null, 2));
        }
        return NextResponse.json({ error: 'Error' }, { status: 500 });
    }
}

function createBubble(product: any): FlexBubble {
    // LINE requires HTTPS for images
    let imageUrl = product.image || 'https://via.placeholder.com/300?text=No+Image';
    if (!imageUrl.startsWith('https')) {
        imageUrl = 'https://via.placeholder.com/300?text=No+Image';
    }

    // Ensure title is not empty and not too long
    const title = product.title ? product.title.substring(0, 40) + '...' : 'No Title';

    // Ensure price is formatted correctly
    const priceText = product.price ? `฿${product.price.toLocaleString()}` : '฿0';

    return {
        type: "bubble",
        size: "micro",
        hero: {
            type: "image",
            url: imageUrl,
            size: "full",
            aspectRatio: "1:1",
            aspectMode: "cover",
            action: {
                type: "uri",
                label: "View Product",
                uri: product.link
            }
        },
        body: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: title,
                    weight: "bold",
                    size: "xs",
                    wrap: true,
                    maxLines: 2
                },
                {
                    type: "box",
                    layout: "baseline",
                    contents: [
                        {
                            type: "text",
                            text: priceText,
                            color: "#ff5551",
                            size: "md",
                            weight: "bold",
                            flex: 0
                        },
                        {
                            type: "text",
                            text: product.sold > 0 ? `ขายแล้ว ${formatSold(product.sold)}` : ' ',
                            color: "#aaaaaa",
                            size: "xxs",
                            align: "end",
                            flex: 1
                        }
                    ],
                    margin: "md"
                }
            ],
            paddingAll: "sm"
        },
        footer: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "button",
                    style: "primary",
                    color: product.platform === 'shopee' ? "#EE4D2D" : "#101988", // Shopee Orange vs Lazada Blue
                    height: "sm",
                    action: {
                        type: "uri",
                        label: "ซื้อเลย 👉",
                        uri: product.link
                    }
                }
            ],
            paddingAll: "sm"
        }
    };
}

function formatSold(num: number): string {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}