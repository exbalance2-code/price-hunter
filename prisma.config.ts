import { defineConfig } from '@prisma/config';

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Construct from component variables if DATABASE_URL is missing
  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE;
  const port = process.env.MYSQL_PORT || '3306';

  if (!host || !user || !password || !database) {
    throw new Error('DATABASE_URL is not set, and MYSQL_* variables are missing. Please check your Render Environment Variables.');
  }

  // Encode password to handle special characters safely
  const encodedPassword = encodeURIComponent(password);
  
  // TiDB usually needs sslaccept=strict
  return `mysql://${user}:${encodedPassword}@${host}:${port}/${database}?sslaccept=strict`;
}

export default defineConfig({
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
});
