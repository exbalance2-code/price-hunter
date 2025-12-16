import { NextResponse } from 'next/server';
import { fetchAccessTradeKeys } from '@/lib/accesstrade-client';
import { query } from '@/lib/db';
import { encrypt } from '@/lib/encryption';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'กรุณากรอก Email และ Password' },
                { status: 400 }
            );
        }

        // 1. Fetch keys from AccessTrade API
        const keys = await fetchAccessTradeKeys(username, password);

        // 2. Validate keys
        if (!keys.userUid || !keys.secretKey) {
            return NextResponse.json(
                { error: 'ไม่พบข้อมูล Keys จาก AccessTrade' },
                { status: 404 }
            );
        }

        // 3. Update Database
        // We need to upsert these settings
        const settingsToUpdate = [
            { key: 'accesstrade_access_key', value: keys.userUid, encrypted: true },
            { key: 'accesstrade_secret_key', value: keys.secretKey, encrypted: true }
        ];

        for (const setting of settingsToUpdate) {
            const finalValue = setting.encrypted ? encrypt(setting.value) : setting.value;

            // Check if exists
            const existing = await query<any[]>(
                'SELECT id FROM system_settings WHERE setting_key = ?',
                [setting.key]
            );

            if (existing.length > 0) {
                await query(
                    'UPDATE system_settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?',
                    [finalValue, setting.key]
                );
            } else {
                await query(
                    'INSERT INTO system_settings (setting_key, setting_value, is_encrypted, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
                    [setting.key, finalValue, setting.encrypted]
                );
            }
        }

        return NextResponse.json({
            success: true,
            userUid: keys.userUid, // Send back to update UI immediately
            secretKey: keys.secretKey
        });

    } catch (error: any) {
        console.error('Auto-Auth Error:', error);
        return NextResponse.json(
            { error: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
            { status: 500 }
        );
    }
}
