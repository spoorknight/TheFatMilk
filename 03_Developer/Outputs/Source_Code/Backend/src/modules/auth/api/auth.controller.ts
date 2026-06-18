import { Router, Request, Response, NextFunction } from 'express';
import {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  forgotPasswordRequestSchema,
  forgotPasswordResetSchema,
} from './auth.schema';
import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { VerifyOtpUseCase } from '../application/use-cases/verify-otp.use-case';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import {
  ForgotPasswordRequestUseCase,
  ForgotPasswordResetUseCase,
} from '../application/use-cases/forgot-password.use-case';
import { PrismaUserRepository } from '../infrastructure/repositories/prisma-user.repository';
import { BcryptPasswordService } from '../infrastructure/services/bcrypt-password.service';
import { JwtTokenService } from '../infrastructure/services/jwt-token.service';
import { DbOtpService } from '../infrastructure/services/db-otp.service';

// --- Dependency Injection (Manual) ---
const userRepository = new PrismaUserRepository();
const passwordService = new BcryptPasswordService();
const tokenService = new JwtTokenService();
const otpService = new DbOtpService();

const registerUseCase = new RegisterUseCase(userRepository, passwordService, otpService);
const verifyOtpUseCase = new VerifyOtpUseCase(userRepository, otpService, tokenService);
const loginUseCase = new LoginUseCase(userRepository, passwordService, tokenService);
const forgotPasswordRequestUseCase = new ForgotPasswordRequestUseCase(userRepository, otpService);
const forgotPasswordResetUseCase = new ForgotPasswordResetUseCase(userRepository, passwordService);

// --- Controller ---
export const authRouter = Router();

// POST /auth/register
authRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = registerSchema.parse(req.body);
    const result = await registerUseCase.execute({
      phone: body.phone,
      password: body.password,
      fullName: body.full_name,
    });

    res.status(200).json({
      success: true,
      data: { user_id: result.userId, otp_sent: true },
      message: `OTP đã gửi đến SĐT ${body.phone}`,
    });
  } catch (error) {
    next(error);
  }
});

// POST /auth/verify-otp
authRouter.post('/verify-otp', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = verifyOtpSchema.parse(req.body);
    const result = await verifyOtpUseCase.execute({
      userId: body.user_id,
      otpCode: body.otp,
      type: body.type,
    });

    res.status(200).json({
      success: true,
      data: {
        user: result.user,
        access_token: result.tokens.accessToken,
        refresh_token: result.tokens.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /auth/login
authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = loginSchema.parse(req.body);
    const result = await loginUseCase.execute({
      phone: body.phone,
      password: body.password,
    });

    res.status(200).json({
      success: true,
      data: {
        user: result.user,
        access_token: result.tokens.accessToken,
        refresh_token: result.tokens.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /auth/forgot-password
authRouter.post('/forgot-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = forgotPasswordRequestSchema.parse(req.body);
    const result = await forgotPasswordRequestUseCase.execute({
      phone: body.phone,
    });

    res.status(200).json({
      success: true,
      data: { user_id: result.userId, otp_sent: true },
      message: `OTP đã gửi đến SĐT ${body.phone}`,
    });
  } catch (error) {
    next(error);
  }
});

// POST /auth/reset-password
authRouter.post('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = forgotPasswordResetSchema.parse(req.body);
    await forgotPasswordResetUseCase.execute({
      userId: body.user_id,
      newPassword: body.new_password,
    });

    res.status(200).json({
      success: true,
      message: 'Đặt lại mật khẩu thành công',
    });
  } catch (error) {
    next(error);
  }
});
