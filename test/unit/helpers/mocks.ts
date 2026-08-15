export const mockEnv = {
  env: jest.fn((key: string) => (key === 'PORT' ? 8000 : `mock-${key}`)),
};

export const mockLogger = {
  log: jest.fn(),
  error: jest.fn(),
};
