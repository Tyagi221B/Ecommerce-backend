import { Request, Response, NextFunction } from 'express';
import { ApiError } from './ApiErrors.js';

const errorHandler = (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
  let customError = err;

  if (!(err instanceof ApiError)) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    customError = new ApiError(statusCode, err.message);
  }

  const apiError = customError as ApiError;

  res.status(apiError.statusCode).json({
    success: apiError.success,
    message: apiError.message,
    errors: apiError.errors,
    data: apiError.data,
  });
};

export { errorHandler };
