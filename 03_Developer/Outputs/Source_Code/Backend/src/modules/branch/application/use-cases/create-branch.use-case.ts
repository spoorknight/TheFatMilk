import { IBranchRepository } from '../../domain/repositories/branch.repository.interface';
import { BranchEntity } from '../../domain/entities/branch.entity';

interface CreateBranchInput {
  name: string;
  address: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  isActive?: boolean;
}

export class CreateBranchUseCase {
  constructor(private readonly branchRepo: IBranchRepository) {}

  async execute(input: CreateBranchInput): Promise<BranchEntity> {
    return this.branchRepo.create({
      name: input.name,
      address: input.address,
      phone: input.phone || null,
      latitude: input.latitude || null,
      longitude: input.longitude || null,
      isActive: input.isActive ?? true,
    });
  }
}
