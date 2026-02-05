import { defineConfig } from '@prisma/config';

// Helper to get or construct the DB URL
function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  
  if (url && url.length > 0) {
    console.log('✅ prisma.config.ts: Using DATABASE_URL from environment.');
    return url;
  }

  console.log('⚠️ prisma.config.ts: DATABASE_URL missing or empty. Constructing from MYSQL_* vars...');
  
  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE;
  const port = process.env.MYSQL_PORT || '3306';

  if (!host || !user || !password || !database) {
    // Log visible error for debugging
    console.error('❌ prisma.config.ts: Missing required MYSQL_* environment variables.');
    console.error(`   Host: ${host ? 'OK' : 'MISSING'}`);
    console.error(`   User: ${user ? 'OK' : 'MISSING'}`);
    console.error(`   Pass: ${password ? 'SET' : 'MISSING'}`);
    console.error(`   DB:   ${database ? 'OK' : 'MISSING'}`);
    
    throw new Error('DATABASE_URL is missing and cannot be constructed from MYSQL_* variables.');
  }

  const encodedPassword = encodeURIComponent(password);
  // TiDB usually needs sslaccept=strict
  return `mysql://${user}:${encodedPassword}@${host}:${port}/${database}?sslaccept=strict`;
}

export default defineConfig({
  datasource: {
    db: {
      url: getDatabaseUrl(),
    },
  },
});
