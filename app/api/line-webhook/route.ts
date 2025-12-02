import { NextResponse } from 'next/server';
import { Client, WebhookEvent, FlexBubble } from '@line/bot-sdk';
import { searchLazadaByPuppeteer } from '@/lib/scraper';
import { convertToAffiliateLink } from '@/lib/affiliate';

const lineConfig = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN || '',
    channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};
const client = new Client(lineConfig);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const events: WebhookEvent[] = body.events;

        for (const event of events) {
            if (event.type === 'message' && event.message.type === 'text') {
                const userMessage = event.message.text.trim();
                const userId = event.source.userId;

                // 1. ตอบกลับทันทีว่ากำลังค้นหา
                if (event.replyToken && event.replyToken !== '00000000000000000000000000000000') {
                    await client.replyMessage(event.replyToken, {
                        type: 'text',
                        text: `🔍 กำลังค้นหาสินค้า "${userMessage}" กรุณารอสักครู่...`
                    });
                }

                // 2. ทำงานเบื้องหลัง
                // ค้นหาจาก Lazada เท่านั้น
                const products = await searchLazadaByPuppeteer(userMessage);

                // เรียงตามราคา (ถูก -> แพง)
                products.sort((a: any, b: any) => a.price - b.price);

                // คัดมาแค่ 5 อันดับแรกที่ถูกที่สุด
                const bestProducts = products.slice(0, 5);

                if (userId) {
                    if (bestProducts.length > 0) {
                        // แปลงลิงก์เป็น Affiliate Link
                        const productsWithAffiliate = await Promise.all(bestProducts.map(async (p: any) => {
                            const affiliateLink = await convertToAffiliateLink(p.link);
                            return { ...p, link: affiliateLink };
                        }));

                        await client.pushMessage(userId, {
                            type: 'flex',
                            altText: `ผลการค้นหา: ${userMessage}`,
                            contents: {
                                type: 'carousel',
                                contents: productsWithAffiliate.map((p: any) => createBubble(p))
                            }
                        });
                    } else {
                        await client.pushMessage(userId, {
                            type: 'text',
                            text: 'ไม่พบสินค้าเลยครับ หรืออาจจะโหลดช้า ลองพิมพ์ใหม่นะ'
                        });
                    }
                }
            }
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: 'Error' }, { status: 500 });
    }
}

function createBubble(product: any): FlexBubble {
    return {
        type: "bubble",
        size: "kilo", // ปรับขนาดการ์ดให้เล็กลง (Micro < Kilo < Mega < Giga)
        hero: {
            type: "image",
            url: product.image || 'https://via.placeholder.com/300',
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
                    text: product.title.substring(0, 40) + '...',
                    weight: "bold",
                    size: "xs", // ลดขนาดฟอนต์ชื่อสินค้า
                    wrap: true,
                    maxLines: 2
                },
                {
                    type: "box",
                    layout: "baseline",
                    contents: [
                        {
                            type: "text",
                            text: `฿${product.price.toLocaleString()}`,
                            color: "#ff5551",
                            size: "md", // ลดขนาดฟอนต์ราคา
                            weight: "bold",
                            flex: 0
                        },
                        {
                            type: "text",
                            text: product.sold > 0 ? `ขายแล้ว ${formatSold(product.sold)}` : '',
                            color: "#aaaaaa",
                            size: "xxs",
                            align: "end",
                            flex: 1
                        }
                    ],
                    margin: "md"
                }
            ],
            paddingAll: "sm" // ลด padding
        },
        footer: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "button",
                    style: "primary",
                    color: "#101988",
                    height: "sm", // ปุ่มเล็กลงสุดได้แค่ sm
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