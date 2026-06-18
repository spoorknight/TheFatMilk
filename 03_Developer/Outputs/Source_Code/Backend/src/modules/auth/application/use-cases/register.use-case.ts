import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IPasswordService } from '../../domain/services/password.service.interface';
import { IOtpService } from '../../domain/services/otp.service.interface';
import { AppError } from '../../../../core/errors/app.error';

interface RegisterInput {
  phone: string;
  password: string;
  fullName: string;
}

interface RegisterOutput {
  userId: string;
  otpCode: string; // In production, this would be sent via SMS instead of returned
}

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly otpService: IOtpService,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterOutput> {
    // 1. Check if phone number already exists
    const existingUser = await this.userRepository.findByPhone(input.phone);
    if (existingUser) {
      throw new AppError('Số điện thoại đã được đăng ký', 409);
    }

    // 2. Hash password
    const passwordHash = await this.passwordService.hash(input.password);

    // 3. Create user with role = 'customer'
    const user = await this.userRepository.create({
      phone: input.phone,
      passwordHash,
      fullName: input.fullName,
    });

    // 4. Generate OTP for account verification
    const otpCode = await this.otpService.generate(user.id, 'register');

    // TODO: In production, send OTP via SMS (e.g., Twilio, Vonage)
    // await this.smsService.send(input.phone, `Mã OTP của bạn: ${otpCode}`);

    return {
      userId: user.id,
      otpCode, // Returned for dev/testing; will be removed in production
    };
  }
}
