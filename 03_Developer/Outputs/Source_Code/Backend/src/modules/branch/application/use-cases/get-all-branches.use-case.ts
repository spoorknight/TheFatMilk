import { IBranchRepository } from '../../domain/repositories/branch.repository.interface';
import { BranchEntity } from '../../domain/entities/branch.entity';

export class GetAllBranchesUseCase {
  constructor(private readonly branchRepo: IBranchRepository) {}

  async execute(isActive?: boolean): Promise<BranchEntity[]> {
    return this.branchRepo.findAll({ isActive });
  }
}
