import { IBranchRepository } from '../../domain/repositories/branch.repository.interface';
import { BranchEntity } from '../../domain/entities/branch.entity';

export class GetNearestBranchesUseCase {
  constructor(private readonly branchRepo: IBranchRepository) {}

  async execute(lat: number, lng: number, limit = 5): Promise<(BranchEntity & { distanceKm: number })[]> {
    return this.branchRepo.findNearest(lat, lng, limit);
  }
}
