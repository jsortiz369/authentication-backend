import { AuthLogoutHandler } from 'src/contexts/auth/application/use-case/commands/auth-logout/auth-logout.handler';
import { AuthLogoutCommand } from 'src/contexts/auth/application/use-case/commands/auth-logout/auth-logout.command';
import { UserNotFoundException } from 'src/contexts/users/domain/exceptions/user-not-found.exception';

const COMMAND = new AuthLogoutCommand('user-uuid', 'session-uuid');

describe('AuthLogoutHandler', () => {
  it('should verify user and revoke session', async () => {
    const userService = { execute: jest.fn().mockResolvedValue({ _id: 'user-uuid' }) } as any;
    const revokeService = { execute: jest.fn().mockResolvedValue(undefined) } as any;
    const handler = new AuthLogoutHandler(userService, revokeService);

    await handler.execute(COMMAND);
    expect(revokeService.execute).toHaveBeenCalledWith('session-uuid', 'user-uuid');
  });

  it('should throw UserNotFoundException when user does not exist', async () => {
    const userService = { execute: jest.fn().mockRejectedValue(new UserNotFoundException()) } as any;
    const revokeService = { execute: jest.fn() } as any;
    const handler = new AuthLogoutHandler(userService, revokeService);

    await expect(handler.execute(COMMAND)).rejects.toThrow(UserNotFoundException);
  });
});
