
export async function convertToAffiliateLink(rawUrl: string) {

    // 0. เช็คว่าเป็น Shopee Affiliate Link อยู่แล้วหรือไม่ (จาก Official API)
    // ถ้าใช่ ให้ส่งกลับได้เลย ไม่ต้องผ่าน Passio ซ้ำ
    if (rawUrl.includes('shope.ee') || rawUrl.includes('s.shopee.co.th')) {
        console.log("✅ ลิงก์นี้เป็น Shopee Affiliate อยู่แล้ว");
        return rawUrl;
    }

    // Default: Return original URL (We only support Shopee direct links now)
    return rawUrl;
}