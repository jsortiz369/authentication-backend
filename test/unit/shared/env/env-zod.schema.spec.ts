import { envZodSchema } from 'src/shared/env/adapters/env-zod.schema';

const VALID_ENV = {
  NODE_ENV: 'development',
  PORT: '8000',
  SECRET_COOKIE: 'some-secret',
  APP_URL: 'http://localhost:3000',
  DB_HOST: 'localhost',
  DB_NAME: 'authdb',
  DB_USERNAME: 'user',
  DB_PASSWORD: 'pass',
  DB_PORT: '5432',
  JWT_SECRET: 'jwt-secret',
  JWT_REFRESH_SECRET: 'jwt-refresh',
  JWT_CONFIRM_SECRET: 'jwt-confirm',
  JWT_EXPIRES_IN: '10m',
  JWT_REFRESH_EXPIRES_IN: '7d',
  REDIS_HOST: 'localhost',
  REDIS_PORT: '6379',
  SMTP_HOST: 'smtp.example.com',
  SMTP_PORT: '1025',
  SMTP_USERNAME: 'user@example.com',
  SMTP_PASSWORD: 'smtp-pass',
  SMTP_TLS: 'false',
};

describe('envZodSchema', () => {
  it('should parse valid env variables', () => {
    const result = envZodSchema.safeParse(VALID_ENV);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.PORT).toBe(8000);
      expect(result.data.DB_PORT).toBe(5432);
      expect(result.data.REDIS_PORT).toBe(6379);
      expect(result.data.SMTP_TLS).toBe(false);
    }
  });

  it('should default NODE_ENV to development when missing', () => {
    const { NODE_ENV: _, ...rest } = VALID_ENV;
    const result = envZodSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.NODE_ENV).toBe('development');
  });

  it('should auto-generate SECRET_COOKIE when missing', () => {
    const { SECRET_COOKIE: _, ...rest } = VALID_ENV;
    const result = envZodSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.SECRET_COOKIE).toBeDefined();
      expect(result.data.SECRET_COOKIE.length).toBe(128); // 64 bytes = 128 hex chars
    }
  });

  it('should fail when PORT is missing', () => {
    const { PORT: _, ...rest } = VALID_ENV;
    const result = envZodSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('should fail when PORT is below 1000', () => {
    const result = envZodSchema.safeParse({ ...VALID_ENV, PORT: '80' });
    expect(result.success).toBe(false);
  });

  it('should fail when PORT is above 65535', () => {
    const result = envZodSchema.safeParse({ ...VALID_ENV, PORT: '70000' });
    expect(result.success).toBe(false);
  });

  it('should fail for invalid NODE_ENV', () => {
    const result = envZodSchema.safeParse({ ...VALID_ENV, NODE_ENV: 'staging' });
    expect(result.success).toBe(false);
  });

  it('should accept JWT_EXPIRES_IN as number string', () => {
    const result = envZodSchema.safeParse({ ...VALID_ENV, JWT_EXPIRES_IN: '3600' });
    expect(result.success).toBe(true);
  });

  it('should accept JWT_EXPIRES_IN with various time units', () => {
    const units = ['10m', '1h', '7d', '30s', '1 Hour', '2 Days', '500ms'];
    for (const unit of units) {
      const result = envZodSchema.safeParse({ ...VALID_ENV, JWT_EXPIRES_IN: unit });
      expect(result.success).toBe(true);
    }
  });

  it('should fail for invalid JWT_EXPIRES_IN format', () => {
    const result = envZodSchema.safeParse({ ...VALID_ENV, JWT_EXPIRES_IN: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('should convert SMTP_TLS string true to boolean true', () => {
    const result = envZodSchema.safeParse({ ...VALID_ENV, SMTP_TLS: 'true' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.SMTP_TLS).toBe(true);
  });

  it('should allow REDIS_PASSWORD to be optional', () => {
    const result = envZodSchema.safeParse(VALID_ENV);
    expect(result.success).toBe(true);
  });

  it('should fail with unknown keys (strict mode)', () => {
    const result = envZodSchema.safeParse({ ...VALID_ENV, UNKNOWN_KEY: 'value' });
    expect(result.success).toBe(false);
  });

  it('should fail when required string fields are empty', () => {
    const result = envZodSchema.safeParse({ ...VALID_ENV, DB_HOST: '' });
    expect(result.success).toBe(false);
  });
});
