export type TokenBytes = 16 | 32 | 64;

type TokenNumberOptions = {
  kind: 'NUMBER';
  length?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
};

type TokenAlphanumericOptions = {
  kind: 'ALPHANUMERIC';
  bytes?: TokenBytes;
};

export type TokenOptions = TokenNumberOptions | TokenAlphanumericOptions;

export abstract class CryptoRepository {
  abstract generateUuidV4(): string;
  abstract validateIsUuidV4(uuid: string): boolean;
  abstract token(options: TokenOptions): string;
  abstract generateCrypt(bytes: TokenBytes): string;
  abstract hash(token: string): string;
  abstract validateHex(hex: string, bytes: TokenBytes): boolean;
}
