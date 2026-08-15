import { UserUpdateFailedAttemptsSingInServices } from 'src/contexts/users/domain/services/user-update-failed-attempts-sing-in.service';

describe('UserUpdateFailedAttemptsSingInServices', () => {
  it('should call updateLoginAttempts with UserId and failedAttempts', async () => {
    const commandRepo = { updateLoginAttempts: jest.fn().mockResolvedValue(undefined) } as any;
    const service = new UserUpdateFailedAttemptsSingInServices(commandRepo);

    await service.execute('550e8400-e29b-41d4-a716-446655440000', 3);

    expect(commandRepo.updateLoginAttempts).toHaveBeenCalledTimes(1);
    expect(commandRepo.updateLoginAttempts.mock.calls[0][0]._value).toBe('550e8400-e29b-41d4-a716-446655440000');
    expect(commandRepo.updateLoginAttempts.mock.calls[0][1]).toBe(3);
  });

  it('should throw if id is not a valid UUID', async () => {
    const commandRepo = { updateLoginAttempts: jest.fn() } as any;
    const service = new UserUpdateFailedAttemptsSingInServices(commandRepo);

    await expect(service.execute('invalid', 0)).rejects.toThrow();
  });
});
