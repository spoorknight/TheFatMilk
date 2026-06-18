import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IPasswordService } from '../../domain/services/password.service.interface';
import { ITokenService, TokenPair } from '../../domain/services/token.service.interface';
import { AppError } from '../../../../core/errors/app.error';

interface LoginInput {
  phone: string;
  password: string;
}

interface LoginOutput {
  tokens: TokenPair;
  user: {
    id: string;
    phone: string;
    fullName: string;
    role: string;
  };
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    // 1. Find user by phone
    const user = await this.userRepository.findByPhone(input.phone);
    if (!user) {
      throw new AppError('Số điện thoại hoặc mật khẩu không đúng', 401);
    }

    // 2. Compare password
    const isMatch = await this.passwordService.compare(input.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Số điện thoại hoặc mật khẩu không đúng', 401);
    }

    // 3. Generate tokens
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
