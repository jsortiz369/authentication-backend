export abstract class JwtRepository {
  abstract generate<T extends object = any>(payload: T): string;

  abstract generateRefresh<T extends object = any>(payload: T): string;

  abstract generateConfirmAccount(payload: { sub: string }): string;

  abstract verify<T extends object = any>(token: string): T;

  abstract verifyRefresh<T extends object = any>(token: string): T;

  abstract verifyConfirmAccount(token: string): { sub: string; iat: number; exp: number };

  abstract expiresInToSeconds(type: 'generate' | 'generateRefresh'): number;
}
