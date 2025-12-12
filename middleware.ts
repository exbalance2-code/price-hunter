import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ป้องกันหน้า Admin (ยกเว้นหน้า login)
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        // ตรวจสอบ cookie หรือ session
        const adminAuth = request.cookies.get('admin_auth');

        if (!adminAuth || adminAuth.value !== process.env.ADMIN_SECRET) {
            // Redirect ไปหน้า login
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // เพิ่ม security headers
    const response = NextResponse.next();

    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    return response;
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
