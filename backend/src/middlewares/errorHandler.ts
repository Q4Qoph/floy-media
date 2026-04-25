import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { errorResponse } from '../utils/apiResponse';

export const errorHandler = (
  error: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json(errorResponse(error.message, error.errors ?? {}));
  }

  const isDev = process.env.NODE_ENV === 'development';
  // eslint-disable-next-line no-console
  console.error(error);

  return res.status(500).json(
    errorResponse(isDev ? error.message : 'Internal server error', isDev ? { name: error.name } : {})
  );
};
