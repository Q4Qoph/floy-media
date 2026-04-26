import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { listByModel } from '../services/crudService';
import { sendEmail } from '../services/emailService';
import { successResponse } from '../utils/apiResponse';

export const createTeamApplication = async (req: Request, res: Response) =>
  res.status(201).json(successResponse('Success', await prisma.teamApplication.create({ data: req.body })));

export const listTeamApplications = async (req: Request, res: Response) =>
  res.json(await listByModel(req, 'teamApplication'));

export const updateTeamApplication = async (req: Request, res: Response) =>
  {
    const existing = await prisma.teamApplication.findUnique({ where: { id: req.params.id } });
    const updated = await prisma.teamApplication.update({ where: { id: req.params.id }, data: req.body });

    if (existing && req.body.status && existing.status !== updated.status) {
      const subject = `FloyMedia application update: ${updated.status}`;
      const text = `Hi ${updated.fullName},\n\nYour FloyMedia team application status is now: ${updated.status}.\n\nThank you,\nFloyMedia`;
      await sendEmail(updated.email, subject, text);
    }

    res.json(successResponse('Success', updated));
  };
  
export const deleteTeamApplication = async (req: Request, res: Response) => {
  await prisma.teamApplication.delete({ where: { id: req.params.id } });
  res.json(successResponse('Success', {}));
};
