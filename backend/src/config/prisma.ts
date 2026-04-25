import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const buildDatabaseUrl = () => {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT || '5432';
  const database = process.env.DB_NAME;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASS || process.env.DB_PASSWORD;
  const ssl = process.env.DB_SSL === 'true';

  if (!host || !database || !user || !password) {
    return null;
  }

  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodeURIComponent(password);
  const base = `postgresql://${encodedUser}:${encodedPassword}@${host}:${port}/${database}`;

  return ssl ? `${base}?sslmode=require` : base;
};

const derivedDatabaseUrl = buildDatabaseUrl();
if (derivedDatabaseUrl) {
  process.env.DATABASE_URL = derivedDatabaseUrl;
}

export const prisma = new PrismaClient();
