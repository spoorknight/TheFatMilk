import { RoleEnum } from '../enums/role.enum';

export class UserEntity {
  constructor(
    public readonly id: string,
    public phone: string,
    public fullName: string,
    public role: RoleEnum | string,
    public passwordHash: string,
    public avatarUrl?: string | null,
    public tierId?: string | null,
    public totalSpent: bigint | number = 0,
    public pointsBalance: number = 0,
    public tierEvaluatedAt?: Date | null,
    public isDeleted: boolean = false,
    public deletedAt?: Date | null,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  public isCustomer(): boolean {
    return this.role === RoleEnum.CUSTOMER;
  }

  public isAdmin(): boolean {
    return this.role === RoleEnum.ADMIN;
  }
}
