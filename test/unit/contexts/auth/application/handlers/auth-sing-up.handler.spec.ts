import { AuthSingUpHandler } from 'src/contexts/auth/application/use-case/commands/auth-sing-up/auth-sing-up.handler';
import { AuthSingUpCommand } from 'src/contexts/auth/application/use-case/commands/auth-sing-up/auth-sing-up.command';

const COMMAND = new AuthSingUpCommand('Juan', 'Garcia', 'jgarcia', '3184567852', 'juan@example.com', 'Pass.1234!');

const mockUser = {
  toValuesPrimitives: () => ({
    _id: 'user-uuid',
    names: 'Juan',
    surnames: 'Garcia',
    username: 'jgarcia',
    phone: '3184567852',
    email: 'juan@example.com',
    confirmed: false,
    status: true,
    failedAttempts: 0,
    lockUntil: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }),
};

describe('AuthSingUpHandler', () => {
  it('should create user and return confirmation token', async () => {
    const userCreate = { execute: jest.fn().mockResolvedValue(mockUser) } as any;
    const confirmService = { execute: jest.fn().mockResolvedValue({ tokenConfirm: 'confirm-jwt' }) } as any;
    const handler = new AuthSingUpHandler(userCreate, confirmService);

    const result = await handler.execute(COMMAND);
    expect(result.token).toBe('confirm-jwt');
    expect(userCreate.execute).toHaveBeenCalledWith(COMMAND);
  });
});
