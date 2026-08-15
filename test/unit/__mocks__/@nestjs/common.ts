// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const actual = jest.requireActual('@nestjs/common');

export const ValidationPipe = jest.fn();

// Re-export everything else from the real module so decorators and exceptions still work
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
module.exports = {
  ...actual,
  ValidationPipe,
};
