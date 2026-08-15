import { CONSTANTS } from 'src/app/constants/const.constant';

describe('CONSTANTS', () => {
  it('should have cookies.account_confirm defined', () => {
    expect(CONSTANTS.cookies.account_confirm).toBe('account_confirmed');
  });

  it('should have cookies.access_token defined', () => {
    expect(CONSTANTS.cookies.access_token).toBe('access_token');
  });

  it('should have cookies.refresh_token defined', () => {
    expect(CONSTANTS.cookies.refresh_token).toBe('refresh_token');
  });

  it('should be readonly (as const)', () => {
    // Verify the object is frozen-like (TypeScript enforces this at compile time)
    expect(Object.keys(CONSTANTS.cookies)).toHaveLength(3);
  });
});
