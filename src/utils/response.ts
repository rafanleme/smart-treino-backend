import { Response } from 'express';

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  errors?: any;
}

export const successResponse = <T>(res: Response, data: T, statusCode: number = 200) => {
  return res.status(statusCode).json({
    data,
  } as ApiResponse<T>);
};

export const errorResponse = (res: Response, message: string, statusCode: number = 500, errors?: any) => {
  return res.status(statusCode).json({
    message,
    errors,
  } as ApiResponse);
};
