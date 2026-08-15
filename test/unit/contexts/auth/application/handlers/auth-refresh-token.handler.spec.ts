import { AuthRefreshTokenHandler } from 'src/contexts/auth/application/use-case/commands/auth-refresh-token/auth-refresh-token.handler';
import { AuthRefreshTokenCommand } from 'src/contexts/auth/application/use-case/commands/auth-refresh-token/auth-refresh-token.command';

const COMMAND = new AuthRefreshTokenCommand('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000');
const USER = { _id: '660e8400-e29b-41d4-a716-446655440000', names: 'Juan', surnames: 'Garcia', username: 'jgarcia', email: 'juan@example.com' };

describe('AuthRefreshTokenHandler', () => {
  it('should rotate tokens and update session', async () => {
    const userService = { execute: jest.fn().mockResolvedValue(USER) } as any;
    const crypto = { hash: jest.fn().mockReturnValue('hashed-refresh') } as any;
    const jwt = {
      expiresInToSeconds: jest.fn().mockReturnValue(604800),
      generate: jest.fn().mockReturnValue('new-access'),
      generateRefresh: jest.fn().mockReturnValue('new-refresh'),
    } as any;
    const cache = { set: jest.fn().mockResolvedValue(undefined) } as any;
    const authCommand = { updateSession: jest.fn().mockResolvedValue(undefined) } as any;
    const handler = new AuthRefreshTokenHandler(userService, crypto, jwt, cache, authCommand);

    const result = await handler.execute(COMMAND);

    expect(result.token).toBe('new-access');
    expect(result.tokenRefresh).toBe('new-refresh');
    expect(authCommand.updateSession).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledTimes(1);
  });
});
