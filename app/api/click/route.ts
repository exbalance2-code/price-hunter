import { NextResponse } from 'next/server';
import { logClick } from '@/lib/analytics';
import { convertToAffiliateLink } from '@/lib/affiliate';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const title = searchParams.get('title') || 'Unknown User';
    const price = searchParams.get('price');
    const query = searchParams.get('query') || '';

    if (!url) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    try {
        // 1. แปลงเป็น Affiliate Link (ถ้ายังไม่ได้แปลง)
        // แต่จริงๆ เราควรทำ Log เฉยๆ แล้ว Redirect ไป url ปลายทางเลย
        // สมมติว่า url ที่ส่งมาคือ Original Link เราจะแปลงตรงนี้ก็ได้
        // หรือถ้าแปลงมาแล้ว ก็ redirect ไปเลย

        // เพื่อความชัวร์และอัพเดท affiliate key เสมอ เราแปลงใหม่ตรงนี้ดีกว่า
        const finalLink = await convertToAffiliateLink(url);

        // 2. ระบุ Platform
        const platform = url.includes('shopee') ? 'shopee' : 'lazada'; // ง่ายๆ

        // 3. บันทึก Log Click จริงๆ
        await logClick(
            title,
            parseFloat(price || '0'),
            platform,
            query
        );

        // 4. Redirect ไปยังสินค้า
        return NextResponse.redirect(finalLink);

    } catch (error) {
        console.error('Click logging error:', error);
        // Fallback ไป url เดิมถ้ามีปัญหา
        return NextResponse.redirect(url);
    }
}
