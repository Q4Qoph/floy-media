import { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { authenticateAdmin } from './auth';

/**
 * Allows unauthenticated /admin/register ONLY when there are zero admins.
 * Once at least one admin exists, registration requires admin JWT.
 */
export const adminBootstrapGuard = async (req: Request, res: Response, next: NextFunction) => {
  const admins = await prisma.adminUser.count();
  if (admins === 0) return next();
  return authenticateAdmin(req as any, res, next);
};

