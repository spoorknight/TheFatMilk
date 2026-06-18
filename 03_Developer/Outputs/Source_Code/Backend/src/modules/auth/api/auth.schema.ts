import { z } from 'zod';

export const registerSchema = z.object({
  phone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 ký tự')
    .max(15, 'Số điện thoại tối đa 15 ký tự')
    .regex(/^0\d+$/, 'Số điện thoại không hợp lệ'),
  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  full_name: z
    .string()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ tên tối đa 100 ký tự'),
});

export const verifyOtpSchema = z.object({
  user_id: z.string().uuid('User ID không hợp lệ'),
  otp: z
    .string()
    .length(6, 'Mã OTP phải có 6 chữ số'),
  type: z
    .enum(['register', 'login', 'reset_password'])
    .default('register'),
});

export const loginSchema = z.object({
  phone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 ký tự')
    .max(15, 'Số điện thoại tối đa 15 ký tự'),
  password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu'),
});

export const forgotPasswordRequestSchema = z.object({
  phone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 ký tự')
    .max(15, 'Số điện thoại tối đa 15 ký tự'),
});

export const forgotPasswordResetSchema = z.object({
  user_id: z.string().uuid('User ID không hợp lệ'),
  new_password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type ForgotPasswordRequestDto = z.infer<typeof forgotPasswordRequestSchema>;
export type ForgotPasswordResetDto = z.infer<typeof forgotPasswordResetSchema>;
