import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { listByModel, getById } from '../services/crudService';
import { successResponse } from '../utils/apiResponse';

export const createBooking = async (req: Request, res: Response) => {
  const booking = await prisma.booking.create({ data: req.body });
  res.status(201).json(successResponse('Success', booking));
};

export const listBookings = async (req: Request, res: Response) => res.json(await listByModel(req, 'booking'));
export const getBooking = async (req: Request, res: Response) =>
  res.json(successResponse('Success', await getById('booking', req.params.id)));
export const updateBooking = async (req: Request, res: Response) =>
  res.json(
    successResponse(
      'Success',
      await prisma.booking.update({ where: { id: req.params.id }, data: req.body })
    )
  );
export const deleteBooking = async (req: Request, res: Response) => {
  await prisma.booking.delete({ where: { id: req.params.id } });
  res.json(successResponse('Success', {}));
};
