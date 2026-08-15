import { UserCreateHandler } from 'src/contexts/users/application/use-case/commands/user-create/user-create.handler';
import { UserConflictEmailException } from 'src/contexts/users/domain/exceptions/user-conflict-email.exception';
import { UserConflictPhoneException } from 'src/contexts/users/domain/exceptions/user-conflict-phone.exception';
import { UserConflictUsernameException } from 'src/contexts/users/domain/exceptions/user-conflict-username.exception';

const COMMAND = {
  names: 'Juan',
  surnames: 'Garcia',
  username: 'jgarcia',
  phone: '3184567852',
  email: 'juan@example.com',
  password: 'Pass.1234!',
};

const makeMocks = () => ({
  crypto: { generateUuidV4: jest.fn().mockReturnValue('550e8400-e29b-41d4-a716-446655440000') } as any,
  query: {
    availableUsername: jest.fn().mockResolvedValue(true),
    availableEmail: jest.fn().mockResolvedValue(true),
    availablePhone: jest.fn().mockResolvedValue(true),
  } as any,
  command: { create: jest.fn().mockResolvedValue(undefined) } as any,
  passwordCreate: { execute: jest.fn().mockResolvedValue(undefined) } as any,
});

describe('UserCreateHandler', () => {
  it('should create and return a User entity', async () => {
    const m = makeMocks();
    const handler = new UserCreateHandler(m.crypto, m.query, m.command, m.passwordCreate);
    const user = await handler.execute(COMMAND);
    expect(user.toValuesPrimitives().email).toBe('juan@example.com');
    expect(m.command.create).toHaveBeenCalledTimes(1);
    expect(m.passwordCreate.execute).toHaveBeenCalledTimes(1);
  });

  it('should throw UserConflictUsernameException', async () => {
    const m = makeMocks();
    m.query.availableUsername.mockResolvedValue(false);
    const handler = new UserCreateHandler(m.crypto, m.query, m.command, m.passwordCreate);
    await expect(handler.execute(COMMAND)).rejects.toThrow(UserConflictUsernameException);
  });

  it('should throw UserConflictEmailException', async () => {
    const m = makeMocks();
    m.query.availableEmail.mockResolvedValue(false);
    const handler = new UserCreateHandler(m.crypto, m.query, m.command, m.passwordCreate);
    await expect(handler.execute(COMMAND)).rejects.toThrow(UserConflictEmailException);
  });

  it('should throw UserConflictPhoneException', async () => {
    const m = makeMocks();
    m.query.availablePhone.mockResolvedValue(false);
    const handler = new UserCreateHandler(m.crypto, m.query, m.command, m.passwordCreate);
    await expect(handler.execute(COMMAND)).rejects.toThrow(UserConflictPhoneException);
  });
});
