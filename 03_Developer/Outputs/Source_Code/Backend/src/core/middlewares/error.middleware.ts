import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/app.error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const issues = (err as any).issues || (err as any).errors || [];
    const formattedErrors = issues.map((issue: any) => ({
      path: issue.path?.join('.') || '',
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      error: {
        code: 'ERR_VALIDATION',
        message: 'Validation failed',
        details: formattedErrors,
      },
    });
  }

  // Handle Custom AppErrors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.errorCode,
        message: err.message,
      },
    });
  }

  // Fallback for unhandled errors
  console.error('Unhandled Exception:', err);
  return res.status(500).json({
    success: false,
    error: {
      code: 'ERR_INTERNAL_SERVER',
      message: 'An unexpected error occurred. Please try again later.',
    },
  });
};
