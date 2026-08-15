import { AuthResetPasswordHandler } from 'src/contexts/auth/application/use-case/commands/auth-reset-password/auth-reset-password.handler';
import { AuthResetPasswordCommand } from 'src/contexts/auth/application/use-case/commands/auth-reset-password/auth-reset-password.command';
import { NotExistTokenRecovePasswordException } from 'src/contexts/auth/domain/exceptions/not-exist-token-recove-password.exception';

const COMMAND = new AuthResetPasswordCommand('raw-token', 'NewPass.1234!');

describe('AuthResetPasswordHandler', () => {
  it('should reset password when token is valid', async () => {
    const crypto = { hash: jest.fn().mockReturnValue('hashed') } as any;
    const cache = { get: jest.fn().mockResolvedValue('user-uuid') } as any;
    const userService = { execute: jest.fn().mockResolvedValue({ _id: 'user-uuid' }) } as any;
    const passwordCreate = { execute: jest.fn().mockResolvedValue(undefined) } as any;
    const handler = new AuthResetPasswordHandler(crypto, cache, userService, passwordCreate);

    await handler.execute(COMMAND);
    expect(passwordCreate.execute).toHaveBeenCalledWith({ password: COMMAND.password, userId: 'user-uuid' });
  });

  it('should throw NotExistTokenRecovePasswordException when token not in cache', async () => {
    const crypto = { hash: jest.fn().mockReturnValue('hashed') } as any;
    const cache = { get: jest.fn().mockResolvedValue(undefined) } as any;
    const userService = { execute: jest.fn() } as any;
    const passwordCreate = { execute: jest.fn() } as any;
    const handler = new AuthResetPasswordHandler(crypto, cache, userService, passwordCreate);

    await expect(handler.execute(COMMAND)).rejects.toThrow(NotExistTokenRecovePasswordException);
  });
});
