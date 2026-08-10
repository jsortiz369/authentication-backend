import { UserPrimitive } from 'src/contexts/users/domain/interfaces';

export interface AuthPrimitive {
  _id: string;
  userId: UserPrimitive['_id'];
  refreshTokenHash: string;
  ip?: string | null;
  browser?: string | null;
  browserVersion?: string | null;
  operatingSystem?: string | null;
  device?: string | null;
  expiresAt: Date;
  revokedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type AuthCreatePrimitive = Omit<AuthPrimitive, 'createdAt' | 'updatedAt'>;
