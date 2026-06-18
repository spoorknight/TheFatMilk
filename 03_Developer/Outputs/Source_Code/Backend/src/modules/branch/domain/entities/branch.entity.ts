export class BranchEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly address: string,
    public readonly phone: string | null,
    public readonly latitude: number | null,
    public readonly longitude: number | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: {
    id: string;
    name: string;
    address: string;
    phone: string | null;
    latitude: number | null;
    longitude: number | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): BranchEntity {
    return new BranchEntity(
      data.id,
      data.name,
      data.address,
      data.phone,
      data.latitude,
      data.longitude,
      data.isActive,
      data.createdAt,
      data.updatedAt,
    );
  }
}
