import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // ตรวจสอบรหัสผ่าน (ควรใช้ bcrypt ใน production)
        if (password === process.env.ADMIN_PASSWORD) {
            // ตั้ง cookie
            const cookieStore = await cookies();
            cookieStore.set('admin_auth', process.env.ADMIN_SECRET || 'default-secret', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json(
            { error: 'Invalid password' },
            { status: 401 }
        );
    } catch (error) {
        console.error('Login error');
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
