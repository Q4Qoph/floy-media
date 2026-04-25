import { Request } from 'express';
import { getPagination } from '../utils/pagination';

export const getSortOrder = (req: Request, fallback = 'createdAt') => {
  const sortBy = String(req.query.sortBy ?? fallback);
  const order = String(req.query.order ?? 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';
  return { [sortBy]: order };
};

export const getPaginationMeta = (total: number, page: number, limit: number) => ({
  total,
  page,
  limit,
  pages: Math.ceil(total / limit)
});

export const parsePagination = getPagination;
