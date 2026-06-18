import { ProductEntity } from '../entities/product.entity';

export interface IProductRepository {
  findById(id: string): Promise<ProductEntity | null>;
  findBySlug(slug: string): Promise<ProductEntity | null>;
  findAll(filters?: { categoryId?: string; isSeasonal?: boolean; isActive?: boolean }): Promise<ProductEntity[]>;
  create(data: Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductEntity>;
  update(id: string, data: Partial<Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ProductEntity>;
  softDelete(id: string): Promise<void>;
}
