import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const buildDatabaseUrl = () => {
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT || '5432';
  const database = process.env.DB_NAME;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASS || process.env.DB_PASSWORD;
  const ssl = process.env.DB_SSL === 'true';

  if (!host || !database || !user || !password) {
    throw new Error(
      'Missing DB env vars. Need DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS (or DB_PASSWORD).'
    );
  }

  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodeURIComponent(password);
  const base = `postgresql://${encodedUser}:${encodedPassword}@${host}:${port}/${database}`;
  return ssl ? `${base}?sslmode=require` : base;
};

const prismaEnvPath = path.resolve(process.cwd(), 'prisma', '.env');
const url = buildDatabaseUrl();

fs.writeFileSync(prismaEnvPath, `DATABASE_URL="${url}"\n`, 'utf8');
// eslint-disable-next-line no-console
console.log(`Wrote Prisma DATABASE_URL to ${prismaEnvPath}`);

