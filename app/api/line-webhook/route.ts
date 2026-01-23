import { NextResponse } from 'next/server';
import { Client, WebhookEvent, FlexBubble } from '@line/bot-sdk';
// import { searchProducts } from '@/lib/scraper';

import { searchShopeeProducts } from '@/lib/shopee-client';
import { LazadaClient } from '@/lib/lazada-client';
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
        channelAccessToken: token || process.env.LINE_CHANNEL_ACCESS_TOKEN || process.env.LINE_ACCESS_TOKEN || '',
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

                // 2. ทำงานเบื้องหลัง (Search Process)
                let bestProducts: any[] = [];
                const searchLimit = 5;

                try {
                    console.log(`Searching for: ${userMessage}`);

                    // Parallel Search: Shopee & Lazada
                    const [shopeeItems, lazadaItems] = await Promise.all([
                        searchShopeeProducts(userMessage, searchLimit).catch(e => {
                            console.error('Shopee Search Failed:', e);
                            return [];
                        }),
                        LazadaClient.searchProducts(userMessage, searchLimit).catch(e => {
                            console.error('Lazada Search Failed:', e);
                            return [];
                        })
                    ]);

                    // Process Shopee Results
                    const formattedShopee = shopeeItems.map(p => ({
                        title: p.name,
                        price: p.price,
                        image: p.imageUrl,
                        link: p.productLink,
                        sold: p.sold || 0,
                        platform: 'shopee'
                    }));

                    // Process Lazada Results
                    // Note: We need to generate affiliate links for Lazada items individually if search didn't return them.
                    const formattedLazadaPromise = lazadaItems.map(async p => {
                        const affLink = await LazadaClient.generateAffiliateLink(p.productLink);
                        return {
                            title: p.name,
                            price: p.price,
                            image: p.imageUrl,
                            link: affLink,
                            sold: p.sold || 0,
                            platform: 'lazada'
                        };
                    });
                    
                    const formattedLazada = await Promise.all(formattedLazadaPromise);

                    // Combine Results (Interleave or just append)
                    // Let's mix them: Shopee1, Lazada1, Shopee2, Lazada2...
                    const mixedResults = [];
                    const maxLen = Math.max(formattedShopee.length, formattedLazada.length);
                    for (let i = 0; i < maxLen; i++) {
                        if (i < formattedShopee.length) mixedResults.push(formattedShopee[i]);
                        if (i < formattedLazada.length) mixedResults.push(formattedLazada[i]);
                    }
                    
                    bestProducts = mixedResults;

                } catch (e: any) {
                    console.error('Search Logic Failed:', e.message);
                }

                // Call to action: Limit total results for carousel (max 10 bubbles usually fine, line max is 10/12)
                if (bestProducts.length > 10) {
                    bestProducts.length = 10;
                }

                // Log search analytics
                await logSearch(userMessage, bestProducts.length);

                if (userId) {
                    if (bestProducts.length > 0) {
                        
                        // Base URL for internal tracking (if needed)
                        let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

                        // Apply internal tracking wrapper if desired
                        const productsWithTracking = bestProducts.map((p: any) => {
                            // original (affiliate) link
                            const originalLink = p.link;

                            // Create Tracking URL (Optional, but keeps consistency with existing logic)
                            const params = new URLSearchParams({
                                url: originalLink,
                                title: (p.title || '').substring(0, 50),
                                price: (p.price || 0).toString(),
                                query: userMessage,
                                platform: p.platform // Add platform param for analytics
                            });

                            const trackingLink = `${baseUrl}/api/click?${params.toString()}`;

                            return { ...p, link: trackingLink };
                        });

                        await client.replyMessage(event.replyToken, {
                            type: 'flex',
                            altText: `ผลการค้นหา: ${userMessage}`,
                            contents: {
                                type: 'carousel',
                                contents: productsWithTracking.map((p: any) => createBubble(p))
                            }
                        });
                    } else {
                        await client.replyMessage(event.replyToken, {
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
        // Try to fix HTTP to HTTPS if possible, fast fix
        imageUrl = imageUrl.replace('http://', 'https://');
    }
    // Final check
    if (!imageUrl.startsWith('https')) {
        imageUrl = 'https://via.placeholder.com/300?text=No+Image';
    }

    // Ensure title is not empty and not too long
    const title = product.title ? product.title.substring(0, 40) + '...' : 'No Title';

    // Ensure price is formatted correctly
    const priceText = product.price ? `฿${product.price.toLocaleString()}` : '฿0';

    // Theme Colors
    const isShopee = product.platform === 'shopee';
    const themeColor = isShopee ? "#EE4D2D" : "#0f146e"; // Shopee Orange vs Lazada Blue
    const platformName = isShopee ? "Shopee" : "Lazada";

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
                            text: platformName, // Show platform name instead of sold if sold is 0?
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
                    color: themeColor,
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
