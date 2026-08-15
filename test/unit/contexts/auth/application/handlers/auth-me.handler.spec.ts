import { AuthMeHandler } from 'src/contexts/auth/application/use-case/queries/auth-me/auth-me.handler';
import { AuthMeQuery } from 'src/contexts/auth/application/use-case/queries/auth-me/auth-me.query';

const QUERY = new AuthMeQuery('user-uuid');

describe('AuthMeHandler', () => {
  it('should return user profile data', async () => {
    const user = { names: 'Juan', surnames: 'Garcia', username: 'jgarcia', email: 'juan@example.com' };
    const userService = { execute: jest.fn().mockResolvedValue(user) } as any;
    const handler = new AuthMeHandler(userService);

    const result = await handler.execute(QUERY);
    expect(result).toEqual({ names: 'Juan', surnames: 'Garcia', username: 'jgarcia', email: 'juan@example.com' });
  });
});
