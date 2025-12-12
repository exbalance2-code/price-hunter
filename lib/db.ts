import mysql from 'mysql2/promise';

// สร้าง Connection Pool
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: Number(process.env.MYSQL_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// ฟังก์ชันสำหรับ query ข้อมูล
export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
    try {
        const [results] = await pool.execute(sql, params);
        return results as T;
    } catch (error: any) {
        console.error('Database query error:', error.message);
        throw error;
    }
}

export default pool;
