export class ProductEntity {
  constructor(
    public readonly id: string,
    public readonly categoryId: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly description: string | null,
    public readonly sku: string,
    public readonly costPrice: number,
    public readonly sellingPrice: number,
    public readonly weight: string | null,
    public readonly ingredients: string | null,
    public readonly allergens: string | null,
    public readonly expiryDays: number | null,
    public readonly storageTemp: string | null,
    public readonly isCombo: boolean,
    public readonly comboPrice: number | null,
    public readonly isSeasonal: boolean,
    public readonly seasonalStart: Date | null,
    public readonly seasonalEnd: Date | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly images: { id: string; url: string; isPrimary: boolean; sortOrder: number }[] = [],
    public readonly comboItems: { productId: string; quantity: number }[] = []
  ) {}
}
