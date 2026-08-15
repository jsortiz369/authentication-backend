import { UserPasswordByIdUserService } from 'src/contexts/users-passwords/domain/services/user-password-by-id-user.service';

describe('UserPasswordByIdUserService', () => {
  it('should return the current password projection', async () => {
    const projection = { password: 'hashed', isCurrent: true };
    const queryRepo = { findCurrentByIdUser: jest.fn().mockResolvedValue(projection) } as any;
    const service = new UserPasswordByIdUserService(queryRepo);

    const result = await service.execute('user-uuid');
    expect(result).toBe(projection);
    expect(queryRepo.findCurrentByIdUser).toHaveBeenCalledWith('user-uuid');
  });

  it('should return null when no current password exists', async () => {
    const queryRepo = { findCurrentByIdUser: jest.fn().mockResolvedValue(null) } as any;
    const service = new UserPasswordByIdUserService(queryRepo);

    const result = await service.execute('user-uuid');
    expect(result).toBeNull();
  });
});
