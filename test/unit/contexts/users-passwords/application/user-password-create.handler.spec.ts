import { UserPasswordCreateHandler } from 'src/contexts/users-passwords/application/use-case/commands/user-password-create/user-password-create.handler';
import { UserPasswordConflictCreatePasswordException } from 'src/contexts/users-passwords/domain/exceptions/user-password-conflict-create-password.exception';

const COMMAND = { userId: '550e8400-e29b-41d4-a716-446655440000', password: 'NewPass.1234!' };

const makeMocks = (existingPasswords: Array<{ password: string }> = []) => ({
  crypto: { generateUuidV4: jest.fn().mockReturnValue('550e8400-e29b-41d4-a716-446655440000') } as any,
  passwordRepo: {
    hash: jest.fn().mockResolvedValue('$2b$12$hashed'),
    compare: jest.fn().mockResolvedValue(false),
  } as any,
  queryRepo: { findAllByIdUser: jest.fn().mockResolvedValue(existingPasswords) } as any,
  commandRepo: { create: jest.fn().mockResolvedValue(undefined) } as any,
});

describe('UserPasswordCreateHandler', () => {
  it('should create a new password when no conflict', async () => {
    const m = makeMocks();
    const handler = new UserPasswordCreateHandler(m.crypto, m.passwordRepo, m.queryRepo, m.commandRepo);

    await handler.execute(COMMAND);

    expect(m.queryRepo.findAllByIdUser).toHaveBeenCalledWith(COMMAND.userId, 3);
    expect(m.passwordRepo.hash).toHaveBeenCalledWith(COMMAND.password);
    expect(m.commandRepo.create).toHaveBeenCalledTimes(1);
  });

  it('should throw UserPasswordConflictCreatePasswordException when reusing existing password', async () => {
    const existing = [{ password: 'old-hash-1' }, { password: 'old-hash-2' }];
    const m = makeMocks(existing);
    // Simulate that the new password matches the first old password
    m.passwordRepo.compare.mockResolvedValueOnce(true);

    const handler = new UserPasswordCreateHandler(m.crypto, m.passwordRepo, m.queryRepo, m.commandRepo);

    await expect(handler.execute(COMMAND)).rejects.toThrow(UserPasswordConflictCreatePasswordException);
    expect(m.commandRepo.create).not.toHaveBeenCalled();
  });

  it('should compare against all existing passwords (up to 3)', async () => {
    const existing = [{ password: 'h1' }, { password: 'h2' }, { password: 'h3' }];
    const m = makeMocks(existing);
    const handler = new UserPasswordCreateHandler(m.crypto, m.passwordRepo, m.queryRepo, m.commandRepo);

    await handler.execute(COMMAND);

    expect(m.passwordRepo.compare).toHaveBeenCalledTimes(3);
    expect(m.passwordRepo.compare).toHaveBeenCalledWith(COMMAND.password, 'h1');
    expect(m.passwordRepo.compare).toHaveBeenCalledWith(COMMAND.password, 'h2');
    expect(m.passwordRepo.compare).toHaveBeenCalledWith(COMMAND.password, 'h3');
  });
});
