import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiErrors.js';

/**
 * Middleware to validate requests using express-validator.
 * If validation errors are found, it throws an ApiError with the details.
 */

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    throw new ApiError(400, 'Validation Error', errorMessages);
  }
  next();
};

export { validateRequest };
