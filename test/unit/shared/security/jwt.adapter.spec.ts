import { JwtAdapter } from 'src/shared/security/adapters/jwt.adapter';
import { EnvRepository } from 'src/shared/env/ports/env.repository';

const mockJwtService = {
  sign: jest.fn().mockReturnValue('signed-token'),
  verify: jest.fn().mockReturnValue({ sub: 'user-id', sid: 'session-id' }),
};

const mockEnv: jest.Mocked<EnvRepository> = {
  baseUrl: 'postgres://localhost',
  env: jest.fn((key: string) => {
    const map: Record<string, string> = {
      JWT_SECRET: 'access-secret',
      JWT_REFRESH_SECRET: 'refresh-secret',
      JWT_CONFIRM_SECRET: 'confirm-secret',
      JWT_EXPIRES_IN: '10m',
      JWT_REFRESH_EXPIRES_IN: '7d',
    };
    return map[key] ?? '';
  }) as any,
  envSystem: jest.fn(),
};

describe('JwtAdapter', () => {
  let jwt: JwtAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    jwt = new JwtAdapter(mockJwtService as any, mockEnv);
  });

  describe('generate', () => {
    it('should sign with JWT_SECRET and JWT_EXPIRES_IN', () => {
      const result = jwt.generate({ sub: 'user-1', sid: 'sess-1' });
      expect(result).toBe('signed-token');
      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: 'user-1', sid: 'sess-1' }, { secret: 'access-secret', expiresIn: '10m' });
    });
  });

  describe('generateRefresh', () => {
    it('should sign with JWT_REFRESH_SECRET and JWT_REFRESH_EXPIRES_IN', () => {
      jwt.generateRefresh({ sub: 'user-1', sid: 'sess-1' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: 'user-1', sid: 'sess-1' }, { secret: 'refresh-secret', expiresIn: '7d' });
    });
  });

  describe('generateConfirmAccount', () => {
    it('should sign with JWT_CONFIRM_SECRET and 1h expiry', () => {
      jwt.generateConfirmAccount({ sub: 'user-1' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: 'user-1' }, { secret: 'confirm-secret', expiresIn: '1h' });
    });
  });

  describe('verify', () => {
    it('should verify with JWT_SECRET', () => {
      const result = jwt.verify('some-token');
      expect(result).toEqual({ sub: 'user-id', sid: 'session-id' });
      expect(mockJwtService.verify).toHaveBeenCalledWith('some-token', { secret: 'access-secret' });
    });
  });

  describe('verifyRefresh', () => {
    it('should verify with JWT_REFRESH_SECRET', () => {
      jwt.verifyRefresh('refresh-token');
      expect(mockJwtService.verify).toHaveBeenCalledWith('refresh-token', { secret: 'refresh-secret' });
    });
  });

  describe('verifyConfirmAccount', () => {
    it('should verify with JWT_CONFIRM_SECRET', () => {
      jwt.verifyConfirmAccount('confirm-token');
      expect(mockJwtService.verify).toHaveBeenCalledWith('confirm-token', { secret: 'confirm-secret' });
    });
  });

  describe('expiresInToSeconds', () => {
    it('should convert "10m" to 600', () => {
      expect(jwt.expiresInToSeconds('generate')).toBe(600);
    });

    it('should convert "7d" to 604800', () => {
      expect(jwt.expiresInToSeconds('generateRefresh')).toBe(604800);
    });

    it('should return number directly if expiresIn is numeric', () => {
      mockEnv.env.mockReturnValueOnce(3600 as any);
      expect(jwt.expiresInToSeconds('generate')).toBe(3600);
    });

    it('should handle seconds (30s)', () => {
      mockEnv.env.mockReturnValueOnce('30s' as any);
      expect(jwt.expiresInToSeconds('generate')).toBe(30);
    });

    it('should handle hours (2h)', () => {
      mockEnv.env.mockReturnValueOnce('2h' as any);
      expect(jwt.expiresInToSeconds('generate')).toBe(7200);
    });

    it('should handle weeks (1w)', () => {
      mockEnv.env.mockReturnValueOnce('1w' as any);
      expect(jwt.expiresInToSeconds('generate')).toBe(604800);
    });

    it('should handle years (1y)', () => {
      mockEnv.env.mockReturnValueOnce('1y' as any);
      expect(jwt.expiresInToSeconds('generate')).toBe(31536000);
    });

    it('should throw for invalid format', () => {
      mockEnv.env.mockReturnValueOnce('invalid' as any);
      expect(() => jwt.expiresInToSeconds('generate')).toThrow();
    });

    it('should throw for unsupported unit', () => {
      mockEnv.env.mockReturnValueOnce('10x' as any);
      expect(() => jwt.expiresInToSeconds('generate')).toThrow('Unidad de tiempo no soportada');
    });
  });
});
