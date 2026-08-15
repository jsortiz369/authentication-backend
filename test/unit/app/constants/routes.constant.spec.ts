import { ROUTES } from 'src/app/constants/routes.constant';

describe('ROUTES', () => {
  it('should have AUTH route starting with /', () => {
    expect(ROUTES.AUTH).toBe('/auth');
  });

  it('should have USERS route starting with /', () => {
    expect(ROUTES.USERS).toBe('/users');
  });
});
