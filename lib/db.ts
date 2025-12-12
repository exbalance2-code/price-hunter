import mysql from 'mysql2/promise';

const dbUrl = process.env.DATABASE_URL
    ? new URL(process.env.DATABASE_URL)
    : null;

// สร้าง Connection Pool
const pool = mysql.createPool({
    host: dbUrl ? dbUrl.hostname : process.env.MYSQL_HOST,
    user: dbUrl ? decodeURIComponent(dbUrl.username) : process.env.MYSQL_USER,
    password: dbUrl ? decodeURIComponent(dbUrl.password) : process.env.MYSQL_PASSWORD,
    database: dbUrl ? dbUrl.pathname.substring(1) : process.env.MYSQL_DATABASE, // remove leading slash
    port: dbUrl ? Number(dbUrl.port) : (Number(process.env.MYSQL_PORT) || 3306),
    ssl: { rejectUnauthorized: false }, // Required for TiDB/Cloud SQL
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

if (dbUrl) {
    console.log('--- DB Connection Debug ---');
    console.log('Host:', dbUrl.hostname);
    console.log('User:', decodeURIComponent(dbUrl.username));
    const pass = decodeURIComponent(dbUrl.password);
    console.log('Pass Length:', pass.length);
    console.log('Pass First 3:', pass.substring(0, 3));
    console.log('Pass Last 3:', pass.substring(pass.length - 3));
    console.log('---------------------------');
}

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
