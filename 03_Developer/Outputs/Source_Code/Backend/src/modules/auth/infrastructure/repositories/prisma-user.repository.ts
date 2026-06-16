import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { prisma } from '../../../../core/database/prisma.service';

export class PrismaUserRepository implements IUserRepository {
  
  private mapToDomain(record: any): UserEntity {
    return new UserEntity(
      record.id,
      record.phone,
      record.fullName,
      record.role,
      record.passwordHash,
      record.avatarUrl,
      record.tierId,
      record.totalSpent,
      record.pointsBalance,
      record.tierEvaluatedAt,
      record.isDeleted,
      record.deletedAt,
      record.createdAt,
      record.updatedAt
    );
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { id, isDeleted: false },
    });
    if (!user) return null;
    return this.mapToDomain(user);
  }

  async findByPhone(phone: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { phone, isDeleted: false },
    });
    if (!user) return null;
    return this.mapToDomain(user);
  }

  async create(user: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserEntity> {
    const created = await prisma.user.create({
      data: {
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
        passwordHash: user.passwordHash,
        avatarUrl: user.avatarUrl,
        tierId: user.tierId,
        totalSpent: user.totalSpent,
        pointsBalance: user.pointsBalance,
        tierEvaluatedAt: user.tierEvaluatedAt,
        isDeleted: user.isDeleted,
      },
    });
    return this.mapToDomain(created);
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...data,
      },
    });
    return this.mapToDomain(updated);
  }
}
