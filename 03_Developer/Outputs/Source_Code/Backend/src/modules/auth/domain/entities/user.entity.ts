import { RoleEnum } from '../enums/role.enum';

export class UserEntity {
  public readonly id: string;
  public readonly phone: string;
  public readonly passwordHash: string;
  public readonly fullName: string;
  public readonly avatarUrl: string | null;
  public readonly role: RoleEnum;
  public readonly tierId: string | null;
  public readonly totalSpent: bigint;
  public readonly pointsBalance: number;
  public readonly tierEvaluatedAt: Date | null;
  public readonly isDeleted: boolean;
  public readonly deletedAt: Date | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: {
    id: string;
    phone: string;
    passwordHash: string;
    fullName: string;
    avatarUrl: string | null;
    role: RoleEnum | string;
    tierId: string | null;
    totalSpent: bigint;
    pointsBalance: number;
    tierEvaluatedAt: Date | null;
    isDeleted: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.phone = props.phone;
    this.passwordHash = props.passwordHash;
    this.fullName = props.fullName;
    this.avatarUrl = props.avatarUrl;
    this.role = props.role as RoleEnum;
    this.tierId = props.tierId;
    this.totalSpent = props.totalSpent;
    this.pointsBalance = props.pointsBalance;
    this.tierEvaluatedAt = props.tierEvaluatedAt;
    this.isDeleted = props.isDeleted;
    this.deletedAt = props.deletedAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
