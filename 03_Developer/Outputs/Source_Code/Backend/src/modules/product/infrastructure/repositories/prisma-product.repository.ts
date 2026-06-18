import { PrismaClient } from '@prisma/client';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { ProductEntity } from '../../domain/entities/product.entity';

export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private toEntity(data: any): ProductEntity {
    return new ProductEntity(
      data.id,
      data.categoryId,
      data.name,
      data.slug,
      data.description,
      data.sku,
      Number(data.costPrice),
      Number(data.sellingPrice),
      data.weight,
      data.ingredients,
      data.allergens,
      data.expiryDays,
      data.storageTemp,
      data.isCombo,
      data.comboPrice ? Number(data.comboPrice) : null,
      data.isSeasonal,
      data.seasonalStart,
      data.seasonalEnd,
      data.isActive,
      data.createdAt,
      data.updatedAt,
      data.images?.map((img: any) => ({
        id: img.id,
        url: img.imageUrl,
        isPrimary: img.isPrimary,
        sortOrder: img.sortOrder,
      })) || [],
      data.comboParentOf?.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
      })) || []
    );
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({
      where: { id, isDeleted: false },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        comboParentOf: true,
      },
    });
    if (!product) return null;
    return this.toEntity(product);
  }

  async findBySlug(slug: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({
      where: { slug, isDeleted: false },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        comboParentOf: true,
      },
    });
    if (!product) return null;
    return this.toEntity(product);
  }

  async findAll(filters?: { categoryId?: string; isSeasonal?: boolean; isActive?: boolean }): Promise<ProductEntity[]> {
    const where: any = { isDeleted: false };
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.isSeasonal !== undefined) where.isSeasonal = filters.isSeasonal;
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;

    const products = await this.prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        comboParentOf: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((p) => this.toEntity(p));
  }

  async create(data: Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductEntity> {
    const product = await this.prisma.product.create({
      data: {
        categoryId: data.categoryId,
        name: data.name,
        slug: data.slug,
        description: data.description,
        sku: data.sku,
        costPrice: data.costPrice,
        sellingPrice: data.sellingPrice,
        weight: data.weight,
        ingredients: data.ingredients,
        allergens: data.allergens,
        expiryDays: data.expiryDays,
        storageTemp: data.storageTemp,
        isCombo: data.isCombo,
        comboPrice: data.comboPrice,
        isSeasonal: data.isSeasonal,
        seasonalStart: data.seasonalStart,
        seasonalEnd: data.seasonalEnd,
        isActive: data.isActive,
        images: {
          create: data.images.map((img) => ({
            imageUrl: img.url,
            isPrimary: img.isPrimary,
            sortOrder: img.sortOrder,
          })),
        },
        comboParentOf: {
          create: data.comboItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        images: true,
        comboParentOf: true,
      },
    });
    return this.toEntity(product);
  }

  async update(id: string, data: Partial<Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ProductEntity> {
    // For a real production app, updating images and combo items might require separate operations or complex nested updates.
    // For simplicity here, we only update scalar fields.
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        categoryId: data.categoryId,
        name: data.name,
        slug: data.slug,
        description: data.description,
        sku: data.sku,
        costPrice: data.costPrice,
        sellingPrice: data.sellingPrice,
        weight: data.weight,
        ingredients: data.ingredients,
        allergens: data.allergens,
        expiryDays: data.expiryDays,
        storageTemp: data.storageTemp,
        isCombo: data.isCombo,
        comboPrice: data.comboPrice,
        isSeasonal: data.isSeasonal,
        seasonalStart: data.seasonalStart,
        seasonalEnd: data.seasonalEnd,
        isActive: data.isActive,
      },
      include: {
        images: true,
        comboParentOf: true,
      },
    });
    return this.toEntity(product);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }
}
