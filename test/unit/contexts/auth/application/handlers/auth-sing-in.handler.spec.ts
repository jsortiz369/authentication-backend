import { AuthSingInHandler } from 'src/contexts/auth/application/use-case/commands/auth-sing-in/auth-sing-in.handler';
import { AuthSingInCommand } from 'src/contexts/auth/application/use-case/commands/auth-sing-in/auth-sing-in.command';
import { IncorrectCredentialsException } from 'src/contexts/auth/domain/exceptions/incorrect-credentials.exceptions';
import { AccountBlockWarningException } from 'src/contexts/auth/domain/exceptions/account-block-warning.exception';
import { AccountLockException } from 'src/contexts/auth/domain/exceptions/account-lock.exception';
import { AccountInactiveException } from 'src/contexts/auth/domain/exceptions/account-inactive.exception';

const COMMAND = new AuthSingInCommand('jgarcia', 'Pass.1234!', '127.0.0.1', 'Desktop', 'Chrome', '120', 'Windows', null, null);

const USER = {
  _id: 'user-uuid',
  names: 'Juan',
  surnames: 'Garcia',
  username: 'jgarcia',
  email: 'juan@example.com',
  confirmed: true,
  status: true,
  failedAttempts: 0,
  lockUntil: null,
};

const makeMocks = (overrides: Partial<typeof USER> = {}) => {
  const user = { ...USER, ...overrides };
  return {
    userService: { execute: jest.fn().mockResolvedValue(user) } as any,
    passwordService: { execute: jest.fn().mockResolvedValue({ password: 'hashed' }) } as any,
    passwordRepo: { compare: jest.fn().mockResolvedValue(true) } as any,
    updateAttempts: { execute: jest.fn().mockResolvedValue(undefined) } as any,
    confirmService: { execute: jest.fn().mockResolvedValue({ tokenConfirm: 'jwt-confirm' }) } as any,
    accessService: {
      execute: jest.fn().mockResolvedValue({
        token: 'access-jwt',
        tokenRefresh: 'refresh-jwt',
        data: { names: 'Juan', surnames: 'Garcia', username: 'jgarcia', email: 'juan@example.com' },
      }),
    } as any,
  };
};

describe('AuthSingInHandler', () => {
  it('should return tokens for valid login', async () => {
    const m = makeMocks();
    const handler = new AuthSingInHandler(m.userService, m.passwordService, m.passwordRepo, m.updateAttempts, m.confirmService, m.accessService);
    const result = await handler.execute(COMMAND);
    expect(result.confirmAccount).toBe(false);
  });

  it('should throw IncorrectCredentialsException when user not found', async () => {
    const m = makeMocks();
    m.userService.execute.mockResolvedValue(null);
    const handler = new AuthSingInHandler(m.userService, m.passwordService, m.passwordRepo, m.updateAttempts, m.confirmService, m.accessService);
    await expect(handler.execute(COMMAND)).rejects.toThrow(IncorrectCredentialsException);
  });

  it('should throw IncorrectCredentialsException when password is wrong', async () => {
    const m = makeMocks();
    m.passwordRepo.compare.mockResolvedValue(false);
    const handler = new AuthSingInHandler(m.userService, m.passwordService, m.passwordRepo, m.updateAttempts, m.confirmService, m.accessService);
    await expect(handler.execute(COMMAND)).rejects.toThrow(IncorrectCredentialsException);
  });

  it('should throw AccountBlockWarningException on 4th failed attempt', async () => {
    const m = makeMocks({ failedAttempts: 3 });
    m.passwordRepo.compare.mockResolvedValue(false);
    const handler = new AuthSingInHandler(m.userService, m.passwordService, m.passwordRepo, m.updateAttempts, m.confirmService, m.accessService);
    await expect(handler.execute(COMMAND)).rejects.toThrow(AccountBlockWarningException);
  });

  it('should throw AccountLockException when account is locked', async () => {
    const future = new Date(Date.now() + 10 * 60 * 1000);
    const m = makeMocks({ lockUntil: future, failedAttempts: 5 });
    const handler = new AuthSingInHandler(m.userService, m.passwordService, m.passwordRepo, m.updateAttempts, m.confirmService, m.accessService);
    await expect(handler.execute(COMMAND)).rejects.toThrow(AccountLockException);
  });

  it('should throw AccountInactiveException when account is inactive', async () => {
    const m = makeMocks({ status: false });
    const handler = new AuthSingInHandler(m.userService, m.passwordService, m.passwordRepo, m.updateAttempts, m.confirmService, m.accessService);
    await expect(handler.execute(COMMAND)).rejects.toThrow(AccountInactiveException);
  });

  it('should return confirmAccount:true when not confirmed', async () => {
    const m = makeMocks({ confirmed: false });
    const handler = new AuthSingInHandler(m.userService, m.passwordService, m.passwordRepo, m.updateAttempts, m.confirmService, m.accessService);
    const result = await handler.execute(COMMAND);
    expect(result.confirmAccount).toBe(true);
  });
});
