import { Request } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { successResponse } from '../utils/apiResponse';
import { getPaginationMeta, getSortOrder, parsePagination } from './queryService';

const prismaAny = prisma as any;

export const getById = async (model: string, id: string) => {
  const row = await prismaAny[model].findUnique({ where: { id } });
  if (!row) throw new AppError('Resource not found', 404, {});
  return row;
};

export const listByModel = async (
  req: Request,
  model: string,
  where: Record<string, unknown> = {}
) => {
  const { page, limit, skip } = parsePagination(req);
  const orderBy = getSortOrder(req);
  const [rows, total] = await Promise.all([
    prismaAny[model].findMany({ where, skip, take: limit, orderBy }),
    prismaAny[model].count({ where })
  ]);

  return successResponse('Success', { items: rows, meta: getPaginationMeta(total, page, limit) });
};
