import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

export const ensureAdminBootstrap = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.create({
    data: { email, passwordHash, fullName: process.env.ADMIN_NAME || 'FloyMedia Admin' }
  });
};

export const loginAdmin = async (email: string, password: string) => {
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) throw new AppError('Invalid credentials', 401, {});

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new AppError('Invalid credentials', 401, {});

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError('JWT secret is not configured', 500, {});

  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];
  const token = jwt.sign({ email: user.email }, secret, {
    subject: user.id,
    expiresIn
  });

  return {
    token,
    admin: { id: user.id, email: user.email, fullName: user.fullName }
  };
};

export const createAdminAccount = async (
  email: string,
  password: string,
  fullName?: string
) => {
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) throw new AppError('Admin account with this email already exists', 409, {});

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await prisma.adminUser.create({
    data: { email, passwordHash, fullName: fullName || null }
  });

  return {
    id: admin.id,
    email: admin.email,
    fullName: admin.fullName
  };
};
