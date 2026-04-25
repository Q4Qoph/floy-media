import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { getById, listByModel } from '../services/crudService';
import { successResponse } from '../utils/apiResponse';

export const createProject = async (req: Request, res: Response) =>
  res.status(201).json(successResponse('Success', await prisma.project.create({ data: req.body })));
export const listProjects = async (req: Request, res: Response) => res.json(await listByModel(req, 'project'));
export const getProject = async (req: Request, res: Response) =>
  res.json(successResponse('Success', await getById('project', req.params.id)));
export const updateProject = async (req: Request, res: Response) =>
  res.json(
    successResponse(
      'Success',
      await prisma.project.update({ where: { id: req.params.id }, data: req.body })
    )
  );
export const deleteProject = async (req: Request, res: Response) => {
  await prisma.project.delete({ where: { id: req.params.id } });
  res.json(successResponse('Success', {}));
};
