import { query } from '../lib/db';
import fs from 'fs';
import path from 'path';

async function setupDatabase() {
    console.log('Starting database setup...');

    try {
        const sqlPath = path.join(process.cwd(), 'scripts', 'create-settings-tables.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // แยกคำสั่งด้วย ; แต่ต้องระวัง logic ใน string เราจะแยกแบบง่ายๆ
        // หมายเหตุ: สคริปต์ SQL ของเราค่อนข้าง simple สามารถแยกด้วย ; ได้
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            if (statement.toLowerCase().startsWith('insert')) {
                // สำหรับ INSERT อาจจะมี params แต่ในไฟล์ sql เราเป็น static value รันได้เลย
                await query(statement);
            } else {
                await query(statement);
            }
            console.log('Executed statement successfully');
        }

        console.log('Database setup completed/verified successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Failed to setup database:', error);
        process.exit(1);
    }
}

setupDatabase();
