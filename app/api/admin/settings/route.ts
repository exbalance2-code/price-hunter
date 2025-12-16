import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { encrypt, decrypt } from '@/lib/encryption';

// GET: ดึงการตั้งค่าทั้งหมด
export async function GET(request: Request) {
    try {
        // ตรวจสอบ authentication
        const cookies = request.headers.get('cookie');
        if (!cookies?.includes('admin_auth')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // ดึงการตั้งค่าจาก database พร้อม Error Handling
        let settings: any[] = [];
        let dbConnectionError = false;

        try {
            settings = await query<any[]>(
                'SELECT setting_key, setting_value, is_encrypted FROM system_settings'
            );
        } catch (dbError: any) {
            console.error('Database connection checking:', dbError.message);

            // ถ้า Table doesn't exist ให้สร้าง Table
            if (dbError.code === 'ER_NO_SUCH_TABLE' || dbError.message?.includes("doesn't exist")) {
                console.log('Tables not found, creating settings tables...');
                try {
                    await query(`
                        CREATE TABLE IF NOT EXISTS system_settings (
                            id INT PRIMARY KEY AUTO_INCREMENT,
                            setting_key VARCHAR(100) UNIQUE NOT NULL,
                            setting_value TEXT NOT NULL,
                            is_encrypted BOOLEAN DEFAULT TRUE,
                            updated_by VARCHAR(50),
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            INDEX idx_setting_key (setting_key)
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                    `);

                    await query(`
                        CREATE TABLE IF NOT EXISTS audit_logs (
                            id INT PRIMARY KEY AUTO_INCREMENT,
                            action VARCHAR(50) NOT NULL,
                            setting_key VARCHAR(100),
                            old_value TEXT,
                            new_value TEXT,
                            changed_by VARCHAR(50) NOT NULL,
                            ip_address VARCHAR(45),
                            user_agent TEXT,
                            changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            INDEX idx_changed_at (changed_at),
                            INDEX idx_setting_key (setting_key)
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                    `);

                    await query(`
                        CREATE TABLE IF NOT EXISTS admin_users (
                            id INT PRIMARY KEY AUTO_INCREMENT,
                            username VARCHAR(50) UNIQUE NOT NULL,
                            password_hash VARCHAR(255) NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            last_login TIMESTAMP NULL,
                            INDEX idx_username (username)
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                    `);

                    // ลองดึงใหม่อีกครั้ง หรือปล่อยว่างไว้ก่อน
                    settings = [];
                } catch (createError) {
                    console.error('Failed to create tables:', createError);
                    dbConnectionError = true;
                }
            } else {
                // Connection Error หรืออื่นๆ
                console.warn('Cannot connect to database or query failed:', dbError.message);
                dbConnectionError = true;
            }
        }

        // Decrypt ค่าที่ encrypted (ถ้า connection ผ่าน)
        const decryptedSettings: Record<string, string> = {};

        if (!dbConnectionError) {
            for (const setting of settings) {
                try {
                    decryptedSettings[setting.setting_key] = setting.is_encrypted
                        ? decrypt(setting.setting_value)
                        : setting.setting_value;
                } catch (error) {
                    console.error(`Failed to decrypt ${setting.setting_key}`);
                    decryptedSettings[setting.setting_key] = '';
                }
            }
        }

        // ถ้าไม่มีใน database ให้ใช้ค่าจาก .env
        const defaultSettings = {
            line_channel_access_token: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
            line_channel_secret: process.env.LINE_CHANNEL_SECRET || '',
            shopee_affiliate_key: process.env.SHOPEE_AFFILIATE_KEY || '',
            shopee_app_id: process.env.SHOPEE_APP_ID || '',
            shopee_api_secret: process.env.SHOPEE_API_SECRET || '',
            lazada_affiliate_key: process.env.LAZADA_AFFILIATE_KEY || '',
            lazada_app_key: process.env.LAZADA_APP_KEY || '',
            lazada_app_secret: process.env.LAZADA_APP_SECRET || '',
            mysql_host: process.env.MYSQL_HOST || '',
            mysql_user: process.env.MYSQL_USER || '',
            mysql_password: process.env.MYSQL_PASSWORD || '',
            mysql_database: process.env.MYSQL_DATABASE || '',
            passio_api_token: process.env.PASSIO_API_TOKEN || '',
            passio_api_url: process.env.PASSIO_API_URL || '',
            accesstrade_access_key: process.env.ACCESSTRADE_ACCESS_KEY || '',
            accesstrade_api_url: process.env.ACCESSTRADE_API_URL || '',
            accesstrade_secret_key: process.env.ACCESSTRADE_SECRET_KEY || '',
        };

        // Merge กับค่า default
        const finalSettings = { ...defaultSettings, ...decryptedSettings };

        // ส่งข้อมูลกลับ พร้อม error flag ถ้ามี
        return NextResponse.json({
            settings: finalSettings,
            dbError: dbConnectionError ? 'Database connection failed. Using default values.' : null
        });
    } catch (error) {
        console.error('Get settings error:', error);
        return NextResponse.json(
            { error: 'Failed to get settings' },
            { status: 500 }
        );
    }
}

// POST: บันทึกการตั้งค่า
export async function POST(request: Request) {
    try {
        // ตรวจสอบ authentication
        const cookies = request.headers.get('cookie');
        if (!cookies?.includes('admin_auth')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { settings } = body;

        if (!settings || typeof settings !== 'object') {
            return NextResponse.json(
                { error: 'Invalid settings data' },
                { status: 400 }
            );
        }

        // บันทึกแต่ละ setting
        for (const [key, value] of Object.entries(settings)) {
            if (typeof value !== 'string') continue;

            // Encrypt sensitive data
            const encryptedValue = encrypt(value);

            // ดึงค่าเก่า (สำหรับ audit log)
            const oldSetting = await query<any[]>(
                'SELECT setting_value, is_encrypted FROM system_settings WHERE setting_key = ?',
                [key]
            );

            let oldValue = '';
            if (oldSetting.length > 0) {
                try {
                    oldValue = oldSetting[0].is_encrypted
                        ? decrypt(oldSetting[0].setting_value)
                        : oldSetting[0].setting_value;
                } catch (error) {
                    oldValue = '[encrypted]';
                }
            }

            // Insert or Update
            await query(
                `INSERT INTO system_settings (setting_key, setting_value, is_encrypted, updated_by)
         VALUES (?, ?, TRUE, 'admin')
         ON DUPLICATE KEY UPDATE 
         setting_value = VALUES(setting_value),
         updated_by = VALUES(updated_by)`,
                [key, encryptedValue]
            );

            // บันทึก Audit Log
            await query(
                `INSERT INTO audit_logs (action, setting_key, old_value, new_value, changed_by, ip_address)
         VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    'update_setting',
                    key,
                    oldValue ? '[hidden]' : '',
                    '[hidden]', // ไม่เก็บค่าจริงใน log
                    'admin',
                    request.headers.get('x-forwarded-for') || 'unknown'
                ]
            );
        }

        return NextResponse.json({ success: true, message: 'Settings saved successfully' });
    } catch (error) {
        console.error('Save settings error:', error);
        return NextResponse.json(
            { error: 'Failed to save settings' },
            { status: 500 }
        );
    }
}
