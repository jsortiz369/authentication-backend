export interface AuthSessionProjection {
  _id: string;
  ip: string | null;
  browser: string | null;
  browserVersion: string | null;
  operatingSystem: string | null;
  device: string | null;
  createdAt: Date;
  expiresAt: Date;
}

export abstract class AuthQueryRepository {
  abstract findActiveSessionsByUserId(userId: string): Promise<AuthSessionProjection[]>;
}
