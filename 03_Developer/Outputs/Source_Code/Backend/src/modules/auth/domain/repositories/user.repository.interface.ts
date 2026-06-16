import { UserEntity } from '../entities/user.entity';

export interface ICreateUserData {
  phone: string;
  fullName: string;
  passwordHash: string;
  role: string;
  avatarUrl?: string | null;
  tierId?: string | null;
  totalSpent?: bigint | number;
  pointsBalance?: number;
  tierEvaluatedAt?: Date | null;
  isDeleted?: boolean;
}

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByPhone(phone: string): Promise<UserEntity | null>;
  create(user: ICreateUserData): Promise<UserEntity>;
  update(id: string, data: Partial<UserEntity>): Promise<UserEntity>;
}
