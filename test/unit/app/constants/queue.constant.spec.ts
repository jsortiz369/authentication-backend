import { QUEUE } from 'src/app/constants/queue.constant';

describe('QUEUE', () => {
  it('should have emails.confirm_account defined', () => {
    expect(QUEUE.emails.confirm_account).toBe('email-confirm-account');
  });

  it('should have emails.recover_password defined', () => {
    expect(QUEUE.emails.recover_password).toBe('email-recover-password');
  });

  it('should not have unexpected queue keys', () => {
    expect(Object.keys(QUEUE.emails)).toEqual(['confirm_account', 'recover_password']);
  });
});
