import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByPhone(phone: string): Promise<UserEntity | null>;
  create(data: {
    phone: string;
    passwordHash: string;
    fullName: string;
    role?: string;
  }): Promise<UserEntity>;
  update(id: string, data: Partial<{
    fullName: string;
    avatarUrl: string;
    passwordHash: string;
    tierId: string | null;
    totalSpent: bigint;
    pointsBalance: number;
    tierEvaluatedAt: Date;
  }>): Promise<UserEntity>;
  softDelete(id: string): Promise<void>;
}
