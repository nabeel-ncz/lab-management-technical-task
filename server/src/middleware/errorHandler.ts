import { Request, Response, NextFunction } from 'express';
import { sendServerError } from '../utils/response';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  console.error('Error:', error);

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err: any) => err.message);
    return res.status(400).json({
      success: false,
      error: `Validation failed: ${messages.join(', ')}`
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return res.status(400).json({
      success: false,
      error: `${field} already exists`
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format'
    });
  }

  // Default server error
  return sendServerError(res, 'Something went wrong');
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 