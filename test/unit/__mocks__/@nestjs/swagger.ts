export const SwaggerModule = {
  createDocument: jest.fn().mockReturnValue({ openapi: '3.0.0' }),
  setup: jest.fn(),
};

export const DocumentBuilder = jest.fn().mockImplementation(() => ({
  setTitle: jest.fn().mockReturnThis(),
  setDescription: jest.fn().mockReturnThis(),
  setVersion: jest.fn().mockReturnThis(),
  addCookieAuth: jest.fn().mockReturnThis(),
  build: jest.fn().mockReturnValue({}),
}));
