import { AuthResetPasswordVerifyTokenHandler } from 'src/contexts/auth/application/use-case/queries/auth-reset-password-verify-token/auth-reset-password-verify-token.handler';
import { AuthResetPasswordVerifyTokenQuery } from 'src/contexts/auth/application/use-case/queries/auth-reset-password-verify-token/auth-reset-password-verify-token.query';

const QUERY = new AuthResetPasswordVerifyTokenQuery('raw-token');

describe('AuthResetPasswordVerifyTokenHandler', () => {
  it('should return { exist: true } when token found', async () => {
    const crypto = { hash: jest.fn().mockReturnValue('hashed') } as any;
    const cache = { get: jest.fn().mockResolvedValue('user-uuid') } as any;
    const handler = new AuthResetPasswordVerifyTokenHandler(crypto, cache);
    expect(await handler.execute(QUERY)).toEqual({ exist: true });
  });

  it('should return { exist: false } when token not found', async () => {
    const crypto = { hash: jest.fn().mockReturnValue('hashed') } as any;
    const cache = { get: jest.fn().mockResolvedValue(undefined) } as any;
    const handler = new AuthResetPasswordVerifyTokenHandler(crypto, cache);
    expect(await handler.execute(QUERY)).toEqual({ exist: false });
  });
});
