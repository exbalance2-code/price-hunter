import axios from 'axios';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';

// ดึง Key จาก Environment Variable
const ACCESSTRADE_KEY = process.env.ACCESSTRADE_KEY;
const INVOLVE_KEY = process.env.INVOLVE_API_KEY;
const INVOLVE_SECRET = process.env.INVOLVE_API_SECRET;
const PASSIO_KEY = process.env.PASSIO_API_KEY; // 👈 เพิ่ม Key ของ Passio

export async function convertToAffiliateLink(rawUrl: string) {

    // 1. ลองใช้ Passio ก่อน (ถ้ามี Key)
    if (PASSIO_KEY) {
        try {
            console.log("🔄 กำลังแปลงลิงก์ด้วย Passio...");
            // ใช้แบบ Dynamic Link ตามเอกสารที่ได้รับมา
            // Format: https://goeco.mobi/?token={token}&url={url}
            const encodedUrl = encodeURIComponent(rawUrl);
            const passioLink = `https://goeco.mobi/?token=${PASSIO_KEY}&url=${encodedUrl}`;

            console.log("💰 ได้ลิงก์ Passio แล้ว! (Dynamic Link)");
            return passioLink;

        } catch (e: any) {
            console.error("⚠️ Passio Convert Failed:", e.message);
        }
    }

    // 2. ลองใช้ AccessTrade (ถ้ามี Key)
    if (ACCESSTRADE_KEY) {
        try {
            console.log("🔄 กำลังแปลงลิงก์ด้วย AccessTrade...");
            const res = await axios.get('https://api.accesstrade.in.th/v1/deeplink', {
                params: { url: rawUrl },
                headers: { 'Authorization': `Key ${ACCESSTRADE_KEY}` }
            });

            // เช็คผลลัพธ์
            if (res.data && res.data.data && res.data.data.link) {
                console.log("💰 ได้ลิงก์ AccessTrade แล้ว!");
                return res.data.data.link;
            }
        } catch (e: any) {
            console.error("⚠️ AccessTrade Convert Failed:", e.message);
        }
    }

    // 3. ถ้า AccessTrade ไม่ได้ ให้ลอง Involve Asia (ถ้ามี Key)
    if (INVOLVE_KEY && INVOLVE_SECRET) {
        try {
            console.log("🔄 กำลังแปลงลิงก์ด้วย Involve Asia...");

            // สร้างลายเซ็นความปลอดภัย (Signature)
            const timestamp = Math.floor(Date.now() / 1000).toString();
            const signature = Base64.stringify(hmacSHA256(INVOLVE_KEY + timestamp, INVOLVE_SECRET));

            const res = await axios.post('https://api.involve.asia/api/deeplink/generate',
                {
                    url: rawUrl
                },
                {
                    headers: {
                        'Authorization': `Bearer ${INVOLVE_KEY}`,
                        'Involve-Signature': signature,
                        'Involve-Timestamp': timestamp,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // เช็คผลลัพธ์
            if (res.data && res.data.data && res.data.data.generated_url) {
                console.log("💰 ได้ลิงก์ Involve Asia แล้ว!");
                return res.data.data.generated_url;
            }
        } catch (e: any) {
            console.error("⚠️ Involve Asia Convert Failed:", e.response?.data || e.message);
        }
    }

    // 4. ถ้าไม่มี Key อะไรเลย หรือแปลงไม่ผ่าน -> ส่งลิงก์เดิมกลับไป
    // (ลูกค้ากดได้เหมือนเดิม แต่เราไม่ได้ค่าคอมฯ)
    return rawUrl;
}