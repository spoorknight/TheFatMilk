import { BranchEntity } from '../entities/branch.entity';

export interface IBranchRepository {
  findById(id: string): Promise<BranchEntity | null>;
  findAll(filters?: { isActive?: boolean }): Promise<BranchEntity[]>;
  findNearest(lat: number, lng: number, limit?: number): Promise<(BranchEntity & { distanceKm: number })[]>;
  create(data: Omit<BranchEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<BranchEntity>;
  update(id: string, data: Partial<Omit<BranchEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<BranchEntity>;
  softDelete(id: string): Promise<void>;
}
