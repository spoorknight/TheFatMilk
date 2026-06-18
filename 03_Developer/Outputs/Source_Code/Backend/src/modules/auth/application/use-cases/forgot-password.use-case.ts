import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IOtpService } from '../../domain/services/otp.service.interface';
import { IPasswordService } from '../../domain/services/password.service.interface';
import { AppError } from '../../../../core/errors/app.error';

// --- Step 1: Request OTP ---

interface ForgotPasswordRequestInput {
  phone: string;
}

interface ForgotPasswordRequestOutput {
  userId: string;
  otpCode: string; // Dev only; production sends via SMS
}

export class ForgotPasswordRequestUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly otpService: IOtpService,
  ) {}

  async execute(input: ForgotPasswordRequestInput): Promise<ForgotPasswordRequestOutput> {
    // 1. Find user by phone
    const user = await this.userRepository.findByPhone(input.phone);
    if (!user) {
      throw new AppError('Số điện thoại chưa được đăng ký', 404);
    }

    // 2. Generate OTP for password reset
    const otpCode = await this.otpService.generate(user.id, 'reset_password');

    // TODO: Send OTP via SMS in production

    return {
      userId: user.id,
      otpCode,
    };
  }
}

// --- Step 2: Reset Password after OTP verified ---

interface ForgotPasswordResetInput {
  userId: string;
  newPassword: string;
}

export class ForgotPasswordResetUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
  ) {}

  async execute(input: ForgotPasswordResetInput): Promise<void> {
    // 1. Validate user exists
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new AppError('Người dùng không tồn tại', 404);
    }

    // 2. Hash new password and update
    const passwordHash = await this.passwordService.hash(input.newPassword);
    await this.userRepository.update(input.userId, { passwordHash });
  }
}
