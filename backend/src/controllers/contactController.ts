import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { listByModel } from '../services/crudService';
import { successResponse } from '../utils/apiResponse';

export const createMessage = async (req: Request, res: Response) =>
  res.status(201).json(successResponse('Success', await prisma.contactMessage.create({ data: req.body })));
export const listMessages = async (req: Request, res: Response) =>
  res.json(await listByModel(req, 'contactMessage'));
export const updateMessage = async (req: Request, res: Response) =>
  res.json(
    successResponse(
      'Success',
      await prisma.contactMessage.update({ where: { id: req.params.id }, data: req.body })
    )
  );
export const deleteMessage = async (req: Request, res: Response) => {
  await prisma.contactMessage.delete({ where: { id: req.params.id } });
  res.json(successResponse('Success', {}));
};
