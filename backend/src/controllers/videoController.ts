import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { getById, listByModel } from '../services/crudService';
import { uploadMediaFile } from '../services/mediaStorageService';
import { AppError } from '../utils/AppError';
import { successResponse } from '../utils/apiResponse';

const parseBoolean = (value: unknown, defaultValue: boolean) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return defaultValue;
};

const getFieldFiles = (req: Request) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  return {
    video: files?.video?.[0],
    thumbnail: files?.thumbnail?.[0]
  };
};

export const createVideo = async (req: Request, res: Response) => {
  const { video, thumbnail } = getFieldFiles(req);
  const videoUpload = video ? await uploadMediaFile(video) : null;
  const thumbnailUpload = thumbnail ? await uploadMediaFile(thumbnail, 'thumbnails') : null;

  const videoUrl = videoUpload?.url ?? req.body.videoUrl;
  if (!videoUrl) throw new AppError('videoUrl is required', 422, {});

  const created = await prisma.videoHighlight.create({
    data: {
      ...req.body,
      videoUrl,
      thumbnailUrl: thumbnailUpload?.url ?? req.body.thumbnailUrl,
      ...(req.body.isPublic !== undefined
        ? { isPublic: parseBoolean(req.body.isPublic, true) }
        : {}),
      ...(req.body.isFeatured !== undefined
        ? { isFeatured: parseBoolean(req.body.isFeatured, false) }
        : {})
    }
  });
  res.status(201).json(successResponse('Success', created));
};

export const listVideos = async (req: Request, res: Response) => {
  const isAdmin = req.baseUrl.startsWith('/admin') || req.originalUrl.startsWith('/admin');
  const where = {
    ...(isAdmin ? {} : { isPublic: true }),
    ...(req.query.categoryId ? { categoryId: String(req.query.categoryId) } : {})
  };
  res.json(await listByModel(req, 'videoHighlight', where));
};

export const getVideo = async (req: Request, res: Response) =>
  res.json(successResponse('Success', await getById('videoHighlight', req.params.id)));
export const updateVideo = async (req: Request, res: Response) => {
  const { video, thumbnail } = getFieldFiles(req);
  const videoUpload = video ? await uploadMediaFile(video) : null;
  const thumbnailUpload = thumbnail ? await uploadMediaFile(thumbnail, 'thumbnails') : null;

  const updated = await prisma.videoHighlight.update({
    where: { id: req.params.id },
    data: {
      ...req.body,
      ...(videoUpload ? { videoUrl: videoUpload.url } : {}),
      ...(thumbnailUpload ? { thumbnailUrl: thumbnailUpload.url } : {}),
      ...(req.body.isPublic !== undefined
        ? { isPublic: parseBoolean(req.body.isPublic, true) }
        : {}),
      ...(req.body.isFeatured !== undefined
        ? { isFeatured: parseBoolean(req.body.isFeatured, false) }
        : {})
    }
  });
  res.json(successResponse('Success', updated));
};
export const deleteVideo = async (req: Request, res: Response) => {
  await prisma.videoHighlight.delete({ where: { id: req.params.id } });
  res.json(successResponse('Success', {}));
};
