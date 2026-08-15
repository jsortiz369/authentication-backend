import { AuthSingUpConfirmHandler } from 'src/contexts/auth/application/use-case/commands/auth-sing-up-confirm/auth-sing-up-confirm.handler';
import { AuthSingUpConfirmCommand } from 'src/contexts/auth/application/use-case/commands/auth-sing-up-confirm/auth-sing-up-confirm.command';
import { AccountAlreadyConfirmedException } from 'src/contexts/auth/domain/exceptions/accont-already-confirmed.exception';
import { AccountConfirmTokenInvalidException } from 'src/contexts/auth/domain/exceptions/account-confirm-token-invalid.exception';

const COMMAND = new AuthSingUpConfirmCommand('123456', 'user-uuid', '127.0.0.1', 'Desktop', 'Chrome', '120', 'Windows', null, null);
const TOKEN_HASH = 'hashed-otp';

const makeMocks = (confirmed = false, cacheValue: string | undefined = TOKEN_HASH) => ({
  userService: { execute: jest.fn().mockResolvedValue({ _id: 'user-uuid', confirmed }) } as any,
  crypto: { hash: jest.fn().mockReturnValue(TOKEN_HASH) } as any,
  cache: { get: jest.fn().mockResolvedValue(cacheValue), delete: jest.fn().mockResolvedValue(undefined) } as any,
  updateConfirm: { execute: jest.fn().mockResolvedValue(undefined) } as any,
  accessService: { execute: jest.fn().mockResolvedValue({ token: 'access', tokenRefresh: 'refresh', data: {} }) } as any,
});

describe('AuthSingUpConfirmHandler', () => {
  it('should confirm account and return tokens', async () => {
    const m = makeMocks();
    const handler = new AuthSingUpConfirmHandler(m.userService, m.crypto, m.cache, m.updateConfirm, m.accessService);
    const result = await handler.execute(COMMAND);
    expect(m.updateConfirm.execute).toHaveBeenCalledWith('user-uuid');
    expect(m.cache.delete).toHaveBeenCalledWith('confirm-account:user-uuid');
    expect(result).toBeDefined();
  });

  it('should throw AccountAlreadyConfirmedException when already confirmed', async () => {
    const m = makeMocks(true);
    const handler = new AuthSingUpConfirmHandler(m.userService, m.crypto, m.cache, m.updateConfirm, m.accessService);
    await expect(handler.execute(COMMAND)).rejects.toThrow(AccountAlreadyConfirmedException);
  });

  it('should throw AccountConfirmTokenInvalidException when OTP does not match', async () => {
    const m = makeMocks(false, 'different-hash');
    const handler = new AuthSingUpConfirmHandler(m.userService, m.crypto, m.cache, m.updateConfirm, m.accessService);
    await expect(handler.execute(COMMAND)).rejects.toThrow(AccountConfirmTokenInvalidException);
  });
});
