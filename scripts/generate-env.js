const fs = require('fs');
const path = require('path');

// Ensure we are in the project root
const envPath = path.resolve(process.cwd(), '.env');

function generateEnv() {
  console.log('🔧 Checking environment configuration...');

  // If DATABASE_URL is already in the environment process, we don't strictly need to write it to .env
  // BUT Prisma sometimes likes having the file. Let's inspect.
  if (process.env.DATABASE_URL) {
    console.log('✅ DATABASE_URL is already set in environment.');
    // We can append it to .env if missing from there, but mostly unnecessary if running in same process.
    // However, for the next command (prisma db push), it relies on process.env or .env file.
    return;
  }

  console.log('⚠️ DATABASE_URL not found. Attempting to construct from MYSQL_* variables...');

  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE;
  const port = process.env.MYSQL_PORT || '3306';

  if (!host || !user || !password || !database) {
    console.warn('❌ Missing MYSQL_* environment variables. Cannot construct DATABASE_URL.');
    console.warn('   Required: MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE');
    // We don't exit(1) because maybe the user configured it differently and this is just a false negative?
    // But realistically, the build will likely fail next.
    return;
  }

  const encodedPassword = encodeURIComponent(password);
  const dbUrl = `mysql://${user}:${encodedPassword}@${host}:${port}/${database}?sslaccept=strict`;
  
  console.log('✅ Constructed DATABASE_URL.');

  // Check if .env exists
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Check if DATABASE_URL is already inside the file text
  if (!envContent.includes('DATABASE_URL=')) {
    console.log('📝 Appending DATABASE_URL to .env file...');
    const newContent = envContent + `\nDATABASE_URL="${dbUrl}"\n`;
    fs.writeFileSync(envPath, newContent);
    console.log('✅ .env file updated.');
  } else {
    console.log('ℹ️ DATABASE_URL entry already exists in .env file.');
  }
}

generateEnv();
