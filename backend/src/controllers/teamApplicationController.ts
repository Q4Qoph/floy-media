import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { listByModel } from '../services/crudService';
import { successResponse } from '../utils/apiResponse';

export const createTeamApplication = async (req: Request, res: Response) =>
  res.status(201).json(successResponse('Success', await prisma.teamApplication.create({ data: req.body })));

export const listTeamApplications = async (req: Request, res: Response) =>
  res.json(await listByModel(req, 'teamApplication'));

export const updateTeamApplication = async (req: Request, res: Response) =>
  res.json(
    successResponse(
      'Success',
      await prisma.teamApplication.update({ where: { id: req.params.id }, data: req.body })
    )
  );
  
export const deleteTeamApplication = async (req: Request, res: Response) => {
  await prisma.teamApplication.delete({ where: { id: req.params.id } });
  res.json(successResponse('Success', {}));
};
