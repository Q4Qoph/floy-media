import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/AppError';

export const validateBody = (schema: Joi.ObjectSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      throw new AppError('Validation failed', 422, error.details);
    }

    req.body = value;
    next();
  };
