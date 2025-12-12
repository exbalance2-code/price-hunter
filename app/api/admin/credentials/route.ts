import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/encryption';

// POST: เปลี่ยน Username/Password
export async function POST(request: Request) {
    try {
        // ตรวจสอบ authentication
        const cookies = request.headers.get('cookie');
        if (!cookies?.includes('admin_auth')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { currentPassword, newUsername, newPassword } = body;

        // Validation
        if (!currentPassword) {
            return NextResponse.json(
                { error: 'Current password is required' },
                { status: 400 }
            );
        }

        if (!newUsername && !newPassword) {
            return NextResponse.json(
                { error: 'New username or password is required' },
                { status: 400 }
            );
        }

        // ตรวจสอบรหัสผ่านปัจจุบัน
        const currentPasswordHash = hashPassword(currentPassword);

        // เช็คกับ .env ก่อน (สำหรับ initial setup)
        const envPassword = process.env.ADMIN_PASSWORD;
        const isEnvPasswordValid = currentPassword === envPassword;

        // เช็คกับ database
        const adminUsers = await query<any[]>(
            'SELECT * FROM admin_users WHERE username = ?',
            ['admin']
        );

        let isValid = isEnvPasswordValid;

        if (adminUsers.length > 0) {
            isValid = verifyPassword(currentPassword, adminUsers[0].password_hash);
        }

        if (!isValid) {
            return NextResponse.json(
                { error: 'Current password is incorrect' },
                { status: 401 }
            );
        }

        // Validate new password
        if (newPassword) {
            if (newPassword.length < 8) {
                return NextResponse.json(
                    { error: 'Password must be at least 8 characters' },
                    { status: 400 }
                );
            }

            // ตรวจสอบความแข็งแรงของรหัสผ่าน
            const hasUpperCase = /[A-Z]/.test(newPassword);
            const hasLowerCase = /[a-z]/.test(newPassword);
            const hasNumber = /[0-9]/.test(newPassword);

            if (!hasUpperCase || !hasLowerCase || !hasNumber) {
                return NextResponse.json(
                    { error: 'Password must contain uppercase, lowercase, and number' },
                    { status: 400 }
                );
            }
        }

        // Validate new username
        if (newUsername) {
            if (newUsername.length < 3) {
                return NextResponse.json(
                    { error: 'Username must be at least 3 characters' },
                    { status: 400 }
                );
            }

            if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
                return NextResponse.json(
                    { error: 'Username can only contain letters, numbers, and underscores' },
                    { status: 400 }
                );
            }
        }

        // อัปเดตข้อมูล
        const username = newUsername || 'admin';
        const passwordHash = newPassword ? hashPassword(newPassword) : (adminUsers[0]?.password_hash || hashPassword(envPassword || ''));

        if (adminUsers.length > 0) {
            // Update existing
            await query(
                'UPDATE admin_users SET username = ?, password_hash = ?, updated_at = NOW() WHERE id = ?',
                [username, passwordHash, adminUsers[0].id]
            );
        } else {
            // Insert new
            await query(
                'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
                [username, passwordHash]
            );
        }

        // บันทึก Audit Log
        await query(
            `INSERT INTO audit_logs (action, setting_key, changed_by, ip_address)
       VALUES (?, ?, ?, ?)`,
            [
                'change_credentials',
                newUsername ? 'username' : 'password',
                'admin',
                request.headers.get('x-forwarded-for') || 'unknown'
            ]
        );

        return NextResponse.json({
            success: true,
            message: 'Credentials updated successfully',
            newUsername: username
        });
    } catch (error) {
        console.error('Change credentials error:', error);
        return NextResponse.json(
            { error: 'Failed to change credentials' },
            { status: 500 }
        );
    }
}
