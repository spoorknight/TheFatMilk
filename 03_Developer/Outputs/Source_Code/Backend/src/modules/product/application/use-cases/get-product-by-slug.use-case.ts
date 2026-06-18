import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { ProductEntity } from '../../domain/entities/product.entity';

export class GetProductBySlugUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(slug: string): Promise<ProductEntity | null> {
    return this.productRepo.findBySlug(slug);
  }
}
