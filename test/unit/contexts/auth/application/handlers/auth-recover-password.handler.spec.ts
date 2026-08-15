import { AuthRecoverPasswordHandler } from 'src/contexts/auth/application/use-case/commands/auth-recover-password/auth-recover-password.handler';
import { AuthRecoverPasswordCommand } from 'src/contexts/auth/application/use-case/commands/auth-recover-password/auth-recover-password.command';

const COMMAND = new AuthRecoverPasswordCommand('jgarcia');

const makeUser = (overrides = {}) => ({
  _id: 'user-uuid',
  names: 'Juan',
  surnames: 'Garcia',
  email: 'juan@example.com',
  confirmed: true,
  status: true,
  ...overrides,
});

const makeMocks = (user: ReturnType<typeof makeUser> | null = makeUser()) => ({
  userService: { execute: jest.fn().mockResolvedValue(user) } as any,
  crypto: { token: jest.fn().mockReturnValue('raw-token'), hash: jest.fn().mockReturnValue('hashed-token') } as any,
  cache: { set: jest.fn().mockResolvedValue(undefined) } as any,
  event: { execute: jest.fn().mockResolvedValue(undefined) } as any,
});

describe('AuthRecoverPasswordHandler', () => {
  it('should enqueue email when user exists and is active', async () => {
    const m = makeMocks();
    const handler = new AuthRecoverPasswordHandler(m.userService, m.crypto, m.cache, m.event);
    await handler.execute(COMMAND);
    expect(m.event.execute).toHaveBeenCalledTimes(1);
    expect(m.cache.set).toHaveBeenCalledWith('recover-password:hashed-token', 'user-uuid', expect.any(Number));
  });

  it('should return silently when user not found', async () => {
    const m = makeMocks(null);
    const handler = new AuthRecoverPasswordHandler(m.userService, m.crypto, m.cache, m.event);
    await expect(handler.execute(COMMAND)).resolves.toBeUndefined();
    expect(m.event.execute).not.toHaveBeenCalled();
  });

  it('should return silently when user is not confirmed', async () => {
    const m = makeMocks(makeUser({ confirmed: false }));
    const handler = new AuthRecoverPasswordHandler(m.userService, m.crypto, m.cache, m.event);
    await expect(handler.execute(COMMAND)).resolves.toBeUndefined();
    expect(m.event.execute).not.toHaveBeenCalled();
  });

  it('should return silently when user is inactive', async () => {
    const m = makeMocks(makeUser({ status: false }));
    const handler = new AuthRecoverPasswordHandler(m.userService, m.crypto, m.cache, m.event);
    await expect(handler.execute(COMMAND)).resolves.toBeUndefined();
    expect(m.event.execute).not.toHaveBeenCalled();
  });
});
