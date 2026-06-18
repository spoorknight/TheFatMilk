import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { ProductEntity } from '../../domain/entities/product.entity';

export class GetAllProductsUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(filters?: { categoryId?: string; isSeasonal?: boolean; isActive?: boolean }): Promise<ProductEntity[]> {
    return this.productRepo.findAll(filters);
  }
}
