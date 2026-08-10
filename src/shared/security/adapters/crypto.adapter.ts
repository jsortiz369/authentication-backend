import crypto from 'node:crypto';

import { REGEX } from 'src/app/constants/reg-ex.constant';
import { CryptoRepository, TokenBytes, TokenOptions } from '../ports/crypto.repository';

export class CryptoAdapter implements CryptoRepository {
  generateUuidV4(): string {
    return crypto.randomUUID();
  }

  validateIsUuidV4(uuid: string): boolean {
    if (!REGEX.UUID_V4.test(uuid)) return false;
    return true;
  }

  token(options: TokenOptions): string {
    if (options.kind === 'NUMBER') {
      const length = options?.length || 6;
      if (!Number.isInteger(length) || length < 1 || length > 16) throw new Error('Invalid TokenLength');
      return Array.from({ length }, () => crypto.randomInt(0, 10)).join('');
    }

    const bytes = options?.bytes || 32;
    if (!Number.isInteger(bytes) || (bytes != 16 && bytes != 32 && bytes != 64)) throw new Error('Invalid TokenBytes');
    return crypto.randomBytes(bytes).toString('hex');
  }

  generateCrypt(bytes: TokenBytes): string {
    if (!Number.isInteger(length) || (bytes != 16 && bytes != 32 && bytes != 64)) throw new Error('Invalid TokenBytes');
    return crypto.randomBytes(bytes).toString('hex');
  }

  hash(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  validateHex(hex: string, bytes: TokenBytes): boolean {
    if (!Number.isInteger(length) || (bytes != 16 && bytes != 32 && bytes != 64)) throw new Error('Invalid TokenBytes');
    const expectedLength = bytes * 2;
    return typeof hex === 'string' && hex.length === expectedLength && /^[0-9a-f]+$/i.test(hex);
  }
}
