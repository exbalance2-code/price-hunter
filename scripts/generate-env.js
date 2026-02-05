const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');

function generateEnv() {
  console.log('🔧 Generating .env file for Prisma...');

  // Try to get DATABASE_URL from environment first
  let dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.log('⚠️ DATABASE_URL not found in environment. Constructing from MYSQL_* variables...');
    
    const host = process.env.MYSQL_HOST;
    const user = process.env.MYSQL_USER;
    const password = process.env.MYSQL_PASSWORD;
    const database = process.env.MYSQL_DATABASE;
    const port = process.env.MYSQL_PORT || '3306';

    if (!host || !user || !password || !database) {
      console.error('❌ Missing required environment variables.');
      console.error(`   MYSQL_HOST: ${host ? 'OK' : 'MISSING'}`);
      console.error(`   MYSQL_USER: ${user ? 'OK' : 'MISSING'}`);
      console.error(`   MYSQL_PASSWORD: ${password ? 'SET' : 'MISSING'}`);
      console.error(`   MYSQL_DATABASE: ${database ? 'OK' : 'MISSING'}`);
      process.exit(1);
    }

    const encodedPassword = encodeURIComponent(password);
    dbUrl = `mysql://${user}:${encodedPassword}@${host}:${port}/${database}?sslaccept=strict`;
    console.log('✅ Constructed DATABASE_URL from components.');
  } else {
    console.log('✅ Using DATABASE_URL from environment.');
  }

  // Always write to .env file to ensure Prisma CLI can read it
  console.log('📝 Writing DATABASE_URL to .env file...');
  fs.writeFileSync(envPath, `DATABASE_URL="${dbUrl}"\n`);
  console.log('✅ .env file created successfully.');
}

generateEnv();
