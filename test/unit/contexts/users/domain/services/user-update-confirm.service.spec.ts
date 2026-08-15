import { UserUpdateConfirmService } from 'src/contexts/users/domain/services/user-update-confirm.service';

describe('UserUpdateConfirmService', () => {
  it('should call updateConfirmed with a UserId', async () => {
    const commandRepo = { updateConfirmed: jest.fn().mockResolvedValue(undefined) } as any;
    const service = new UserUpdateConfirmService(commandRepo);

    await service.execute('550e8400-e29b-41d4-a716-446655440000');

    expect(commandRepo.updateConfirmed).toHaveBeenCalledTimes(1);
    expect(commandRepo.updateConfirmed.mock.calls[0][0]._value).toBe('550e8400-e29b-41d4-a716-446655440000');
  });

  it('should throw if id is not a valid UUID', async () => {
    const commandRepo = { updateConfirmed: jest.fn() } as any;
    const service = new UserUpdateConfirmService(commandRepo);

    await expect(service.execute('invalid-id')).rejects.toThrow();
  });
});
