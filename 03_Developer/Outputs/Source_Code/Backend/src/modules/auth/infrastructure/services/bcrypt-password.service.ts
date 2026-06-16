import bcrypt from 'bcryptjs';
import { IPasswordService } from '../../domain/services/password.service.interface';

export class BcryptPasswordService implements IPasswordService {
  private readonly saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
