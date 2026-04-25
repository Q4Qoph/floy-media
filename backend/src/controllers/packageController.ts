import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { listByModel } from '../services/crudService';
import { successResponse } from '../utils/apiResponse';

export const createPackage = async (req: Request, res: Response) =>
  res.status(201).json(successResponse('Success', await prisma.package.create({ data: req.body })));

export const listPackages = async (req: Request, res: Response) => {
  const where = req.path.startsWith('/admin') ? {} : { isActive: true };
  res.json(await listByModel(req, 'package', where));
};

export const updatePackage = async (req: Request, res: Response) =>
  res.json(
    successResponse(
      'Success',
      await prisma.package.update({ where: { id: req.params.id }, data: req.body })
    )
  );
  
export const deletePackage = async (req: Request, res: Response) => {
  await prisma.package.delete({ where: { id: req.params.id } });
  res.json(successResponse('Success', {}));
};
