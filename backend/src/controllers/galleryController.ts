import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { listByModel, getById } from '../services/crudService';
import { uploadMediaFile } from '../services/mediaStorageService';
import { AppError } from '../utils/AppError';
import { successResponse } from '../utils/apiResponse';
import { toSlug } from '../utils/slug';

const parseBoolean = (value: unknown, defaultValue: boolean) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return defaultValue;
};

const getFieldFiles = (req: Request) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  return {
    file: files?.file?.[0],
    thumbnail: files?.thumbnail?.[0]
  };
};

export const uploadGalleryFiles = async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[]) ?? [];
  if (!files.length) throw new AppError('No files uploaded', 400, {});
  const items = await Promise.all(files.map((file) => uploadMediaFile(file)));
  res.status(201).json(successResponse('Success', items));
};

export const createGalleryItem = async (req: Request, res: Response) => {
  const { file, thumbnail } = getFieldFiles(req);
  const fileUpload = file ? await uploadMediaFile(file) : null;
  const thumbnailUpload = thumbnail ? await uploadMediaFile(thumbnail, 'thumbnails') : null;
  const created = await prisma.galleryItem.create({
    data: {
      ...req.body,
      ...(req.body.isFeatured !== undefined
        ? { isFeatured: parseBoolean(req.body.isFeatured, false) }
        : {}),
      ...(req.body.isPublic !== undefined
        ? { isPublic: parseBoolean(req.body.isPublic, true) }
        : {}),
      fileUrl: fileUpload?.url ?? req.body.fileUrl,
      thumbnailUrl: thumbnailUpload?.url ?? req.body.thumbnailUrl
    }
  });
  res.status(201).json(successResponse('Success', created));
};

export const listGallery = async (req: Request, res: Response) => {
  const where: Prisma.GalleryItemWhereInput = {
    ...(req.path.startsWith('/admin') ? {} : { isPublic: true }),
    ...(req.query.mediaType ? { mediaType: String(req.query.mediaType) as any } : {}),
    ...(req.query.featured ? { isFeatured: String(req.query.featured) === 'true' } : {}),
    ...(req.query.categoryId ? { categoryId: String(req.query.categoryId) } : {})
  };
  res.json(await listByModel(req, 'galleryItem', where));
};

export const getGalleryItem = async (req: Request, res: Response) =>
  res.json(successResponse('Success', await getById('galleryItem', req.params.id)));
export const updateGalleryItem = async (req: Request, res: Response) => {
  const { file, thumbnail } = getFieldFiles(req);
  const fileUpload = file ? await uploadMediaFile(file) : null;
  const thumbnailUpload = thumbnail ? await uploadMediaFile(thumbnail, 'thumbnails') : null;
  const updated = await prisma.galleryItem.update({
    where: { id: req.params.id },
    data: {
      ...req.body,
      ...(req.body.isFeatured !== undefined
        ? { isFeatured: parseBoolean(req.body.isFeatured, false) }
        : {}),
      ...(req.body.isPublic !== undefined
        ? { isPublic: parseBoolean(req.body.isPublic, true) }
        : {}),
      ...(fileUpload ? { fileUrl: fileUpload.url } : {}),
      ...(thumbnailUpload ? { thumbnailUrl: thumbnailUpload.url } : {})
    }
  });
  res.json(successResponse('Success', updated));
};
export const deleteGalleryItem = async (req: Request, res: Response) => {
  await prisma.galleryItem.delete({ where: { id: req.params.id } });
  res.json(successResponse('Success', {}));
};

export const createGalleryCategory = async (req: Request, res: Response) => {
  const created = await prisma.galleryCategory.create({
    data: { ...req.body, slug: req.body.slug || toSlug(req.body.name) }
  });
  res.status(201).json(successResponse('Success', created));
};

export const listGalleryCategories = async (_req: Request, res: Response) => {
  const rows = await prisma.galleryCategory.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(successResponse('Success', rows));
};

export const updateGalleryCategory = async (req: Request, res: Response) => {
  const updated = await prisma.galleryCategory.update({
    where: { id: req.params.id },
    data: { ...req.body, ...(req.body.name && !req.body.slug ? { slug: toSlug(req.body.name) } : {}) }
  });
  res.json(successResponse('Success', updated));
};

export const deleteGalleryCategory = async (req: Request, res: Response) => {
  await prisma.galleryCategory.delete({ where: { id: req.params.id } });
  res.json(successResponse('Success', {}));
};
