import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, ValidationError } from '../errors/app.error';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(`[Error] ${err.name}: ${err.message}`);

  if (err instanceof ZodError) {
    const formattedErrors = (err as any).errors.map((e: any) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    
    res.status(400).json({
      success: false,
      code: 'ERR_VALIDATION',
      message: 'Validation failed',
      errors: formattedErrors,
    });
    return;
  }

  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      success: false,
      code: err.errorCode,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      code: err.errorCode || 'ERR_INTERNAL',
      message: err.message,
    });
    return;
  }

  // Handle generic JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      code: 'ERR_UNAUTHORIZED',
      message: 'Invalid or expired token',
    });
    return;
  }

  // Fallback to 500 Internal Server Error
  res.status(500).json({
    success: false,
    code: 'ERR_INTERNAL',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};
