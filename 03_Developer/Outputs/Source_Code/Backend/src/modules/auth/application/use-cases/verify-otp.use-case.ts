import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IOtpService } from '../../domain/services/otp.service.interface';
import { ITokenService, TokenPair } from '../../domain/services/token.service.interface';
import { AppError } from '../../../../core/errors/app.error';

interface VerifyOtpInput {
  userId: string;
  otpCode: string;
  type: string; // 'register', 'login', 'reset_password'
}

interface VerifyOtpOutput {
  tokens: TokenPair;
  user: {
    id: string;
    phone: string;
    fullName: string;
    role: string;
  };
}

export class VerifyOtpUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly otpService: IOtpService,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: VerifyOtpInput): Promise<VerifyOtpOutput> {
    // 1. Validate user exists
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new AppError('Người dùng không tồn tại', 404);
    }

    // 2. Verify OTP (single-use: auto-deleted after success)
    const isValid = await this.otpService.verify(input.userId, input.otpCode, input.type);
    if (!isValid) {
      throw new AppError('Mã OTP không hợp lệ hoặc đã hết hạn', 400);
    }

    // 3. Generate Access + Refresh Token
    const tokens = this.tokenService.generateTokenPair({
      userId: user.id,
      role: user.role,
    });

    return {
      tokens,
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
}
