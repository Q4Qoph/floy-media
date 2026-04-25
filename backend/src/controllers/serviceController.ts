import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { getById, listByModel } from '../services/crudService';
import { uploadMediaFile } from '../services/mediaStorageService';
import { successResponse } from '../utils/apiResponse';

const parseBoolean = (value: unknown, defaultValue: boolean) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return defaultValue;
};

const getImageFile = (req: Request) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  return files?.image?.[0];
};

export const createService = async (req: Request, res: Response) => {
  const image = getImageFile(req);
  const imageUpload = image ? await uploadMediaFile(image) : null;
  const created = await prisma.service.create({
    data: {
      ...req.body,
      imageUrl: imageUpload?.url ?? req.body.imageUrl,
      ...(req.body.isActive !== undefined
        ? { isActive: parseBoolean(req.body.isActive, true) }
        : {})
    }
  });
  res.status(201).json(successResponse('Success', created));
};

export const listServices = async (req: Request, res: Response) => {
  const where = req.path.startsWith('/admin') ? {} : { isActive: true };
  res.json(await listByModel(req, 'service', where));
};

export const getService = async (req: Request, res: Response) =>
  res.json(successResponse('Success', await getById('service', req.params.id)));
export const updateService = async (req: Request, res: Response) => {
  const image = getImageFile(req);
  const imageUpload = image ? await uploadMediaFile(image) : null;
  const updated = await prisma.service.update({
    where: { id: req.params.id },
    data: {
      ...req.body,
      ...(imageUpload ? { imageUrl: imageUpload.url } : {}),
      ...(req.body.isActive !== undefined
        ? { isActive: parseBoolean(req.body.isActive, true) }
        : {})
    }
  });
  res.json(successResponse('Success', updated));
};
export const deleteService = async (req: Request, res: Response) => {
  await prisma.service.delete({ where: { id: req.params.id } });
  res.json(successResponse('Success', {}));
};
