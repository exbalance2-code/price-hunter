import { NextResponse } from 'next/server';

// Keep-alive endpoint - ping ตัวเองเพื่อป้องกัน Render spin down
export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://price-hunter-bot.onrender.com';

    try {
        const response = await fetch(`${baseUrl}/api/health`, {
            method: 'GET',
            cache: 'no-store',
        });

        const data = await response.json();

        return NextResponse.json({
            success: true,
            message: 'Keep-alive ping successful',
            health: data,
            pingedAt: new Date().toISOString(),
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Keep-alive ping failed',
                error: String(error),
            },
            { status: 500 }
        );
    }
}
