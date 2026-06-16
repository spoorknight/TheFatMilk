import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IPasswordService } from '../../domain/services/password.service.interface';
import { IOtpService } from '../../domain/services/otp.service.interface';
import { AppError } from '../../../../core/errors/app.error';

export interface RegisterRequestDTO {
  phone: string;
  fullName: string;
  passwordRaw: string;
}

export interface RegisterResponseDTO {
  phone: string;
  otpSent: boolean;
}

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly otpService: IOtpService
  ) {}

  async execute(dto: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    const { phone, fullName, passwordRaw } = dto;

    // 1. Check duplicate phone
    const existingUser = await this.userRepository.findByPhone(phone);
    if (existingUser) {
      throw new AppError('Số điện thoại đã được đăng ký', 400, 'ERR_DUPLICATE');
    }

    // 2. Hash password
    const passwordHash = await this.passwordService.hashPassword(passwordRaw);

    // 3. Create User in DB (initially created, OTP verify will grant token)
    // Note: If the business requires 'isActive' state, we might add it later to the entity
    const newUser = await this.userRepository.create({
      phone,
      fullName,
      passwordHash,
      role: 'customer',
      totalSpent: 0n,
      pointsBalance: 0,
      isDeleted: false,
    });

    // 4. Generate & Send OTP
    await this.otpService.generateAndSendOtp(newUser.id, newUser.phone);

    return {
      phone: newUser.phone,
      otpSent: true,
    };
  }
}
