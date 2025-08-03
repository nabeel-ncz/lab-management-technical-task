import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 400
): Response => {
  const response: ApiResponse<null> = {
    success: false,
    error
  };
  return res.status(statusCode).json(response);
};

export const sendServerError = (
  res: Response,
  error: string = 'Internal server error'
): Response => {
  return sendError(res, error, 500);
}; 