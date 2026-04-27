import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { listByModel } from '../services/crudService';
import { successResponse } from '../utils/apiResponse';

export const createMessage = async (req: Request, res: Response) =>
  res.status(201).json(successResponse('Success', await prisma.contactMessage.create({ data: req.body })));
export const listMessages = async (req: Request, res: Response) => {
  const status = req.query.status ? String(req.query.status) : undefined;
  const readParam = req.query.read !== undefined ? String(req.query.read) : undefined;
  const read = readParam === undefined ? undefined : readParam === 'true';

  const where: Prisma.ContactMessageWhereInput = {
    ...(status
      ? { status: status as any }
      : read === true
        ? { NOT: { status: 'New' } }
        : read === false
          ? { status: 'New' }
          : {})
  };

  res.json(await listByModel(req, 'contactMessage', where));
};
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
