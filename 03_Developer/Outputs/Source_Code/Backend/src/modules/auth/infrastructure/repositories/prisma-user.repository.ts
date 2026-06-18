import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { prisma } from '../../../../core/database/prisma.service';

export class PrismaUserRepository implements IUserRepository {
  private toEntity(record: any): UserEntity {
    return new UserEntity({
      id: record.id,
      phone: record.phone,
      passwordHash: record.passwordHash,
      fullName: record.fullName,
      avatarUrl: record.avatarUrl,
      role: record.role,
      tierId: record.tierId,
      totalSpent: record.totalSpent,
      pointsBalance: record.pointsBalance,
      tierEvaluatedAt: record.tierEvaluatedAt,
      isDeleted: record.isDeleted,
      deletedAt: record.deletedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async findById(id: string): Promise<UserEntity | null> {
    const record = await prisma.user.findFirst({
      where: { id, isDeleted: false },
    });
    return record ? this.toEntity(record) : null;
  }

  async findByPhone(phone: string): Promise<UserEntity | null> {
    const record = await prisma.user.findFirst({
      where: { phone, isDeleted: false },
    });
    return record ? this.toEntity(record) : null;
  }

  async create(data: {
    phone: string;
    passwordHash: string;
    fullName: string;
    role?: string;
  }): Promise<UserEntity> {
    const record = await prisma.user.create({
      data: {
        phone: data.phone,
        passwordHash: data.passwordHash,
        fullName: data.fullName,
        role: data.role ?? 'customer',
      },
    });
    return this.toEntity(record);
  }

  async update(id: string, data: Partial<{
    fullName: string;
    avatarUrl: string;
    passwordHash: string;
    tierId: string | null;
    totalSpent: bigint;
    pointsBalance: number;
    tierEvaluatedAt: Date;
  }>): Promise<UserEntity> {
    const record = await prisma.user.update({
      where: { id },
      data,
    });
    return this.toEntity(record);
  }

  async softDelete(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }
}
