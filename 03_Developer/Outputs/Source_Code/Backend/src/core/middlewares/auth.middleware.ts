import { Request, Response, NextFunction } from 'express';
import { JwtTokenService } from '../../modules/auth/infrastructure/services/jwt-token.service';
import { AppError } from '../errors/app.error';

const tokenService = new JwtTokenService();

// Extend Express Request to include user payload
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware xác thực JWT Access Token.
 * Gắn `req.user` nếu token hợp lệ.
 */
export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token không được cung cấp', 401);
    }

    const token = authHeader.split(' ')[1];
    const payload = tokenService.verifyAccessToken(token);

    req.user = payload;
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Token không hợp lệ', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token đã hết hạn', 401));
    }
    next(error);
  }
};

/**
 * Middleware phân quyền theo Role.
 * Sử dụng sau `authMiddleware`.
 * @example app.get('/admin', authMiddleware, roleGuard('admin'), handler);
 */
export const roleGuard = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Chưa xác thực', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Bạn không có quyền truy cập', 403));
    }

    next();
  };
};
