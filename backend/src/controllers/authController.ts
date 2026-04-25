import { Request, Response } from 'express';
import { createAdminAccount, loginAdmin } from '../services/authService';
import { getById } from '../services/crudService';
import { AuthRequest } from '../middlewares/auth';
import { successResponse } from '../utils/apiResponse';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = await loginAdmin(email, password);
  res.json(successResponse('Success', data));
};

export const profile = async (req: AuthRequest, res: Response) => {
  const admin = await getById('adminUser', req.admin!.id);
  res.json(successResponse('Success', { id: admin.id, email: admin.email, fullName: admin.fullName }));
};

export const register = async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;
  const created = await createAdminAccount(email, password, fullName);
  res.status(201).json(successResponse('Success', created));
};
