import { PrismaClient } from '@prisma/client';
import { IBranchRepository } from '../../domain/repositories/branch.repository.interface';
import { BranchEntity } from '../../domain/entities/branch.entity';

export class PrismaBranchRepository implements IBranchRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private toEntity(data: any): BranchEntity {
    return BranchEntity.create({
      id: data.id,
      name: data.name,
      address: data.address,
      phone: data.phone,
      latitude: data.latitude ? Number(data.latitude) : null,
      longitude: data.longitude ? Number(data.longitude) : null,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  async findById(id: string): Promise<BranchEntity | null> {
    const branch = await this.prisma.branch.findUnique({
      where: { id, isDeleted: false },
    });
    if (!branch) return null;
    return this.toEntity(branch);
  }

  async findAll(filters?: { isActive?: boolean }): Promise<BranchEntity[]> {
    const where: any = { isDeleted: false };
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const branches = await this.prisma.branch.findMany({ where });
    return branches.map((b) => this.toEntity(b));
  }

  async findNearest(lat: number, lng: number, limit = 5): Promise<(BranchEntity & { distanceKm: number })[]> {
    // Note: This uses raw query to calculate distance (Haversine formula) in Postgres
    // Distance in Kilometers
    const rawBranches = await this.prisma.$queryRaw<any[]>`
      SELECT *,
        (6371 * acos(cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng})) + sin(radians(${lat})) * sin(radians(latitude)))) AS distance
      FROM "branches"
      WHERE is_deleted = false AND is_active = true AND latitude IS NOT NULL AND longitude IS NOT NULL
      ORDER BY distance ASC
      LIMIT ${limit}
    `;

    return rawBranches.map((b) => {
      const entity = this.toEntity({
        ...b,
        isActive: b.is_active,
        createdAt: b.created_at,
        updatedAt: b.updated_at,
      });
      return Object.assign(entity, { distanceKm: Number(b.distance) });
    });
  }

  async create(data: Omit<BranchEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<BranchEntity> {
    const branch = await this.prisma.branch.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        latitude: data.latitude,
        longitude: data.longitude,
        isActive: data.isActive,
      },
    });
    return this.toEntity(branch);
  }

  async update(id: string, data: Partial<Omit<BranchEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<BranchEntity> {
    const branch = await this.prisma.branch.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        latitude: data.latitude,
        longitude: data.longitude,
        isActive: data.isActive,
      },
    });
    return this.toEntity(branch);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.branch.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }
}
