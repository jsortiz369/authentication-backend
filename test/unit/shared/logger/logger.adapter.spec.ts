import fs from 'node:fs';
import { LoggerAdapter } from 'src/shared/logger/adapters/logger.adapter';
import { EnvRepository } from 'src/shared/env/ports/env.repository';

jest.mock('node:fs');

const createMockEnv = (nodeEnv = 'development'): jest.Mocked<EnvRepository> =>
  ({
    baseUrl: '',
    env: jest.fn().mockReturnValue(nodeEnv),
    envSystem: jest.fn(),
  }) as any;

describe('LoggerAdapter', () => {
  let logger: LoggerAdapter;
  let mockEnv: jest.Mocked<EnvRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    // By default: directory exists, file exists → appendFileSync is called
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.appendFileSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

    mockEnv = createMockEnv('development');
    logger = new LoggerAdapter(mockEnv);
  });

  describe('log', () => {
    it('should write to log file in development', () => {
      logger.log('test message');
      expect(fs.appendFileSync).toHaveBeenCalledTimes(1);
      expect(fs.appendFileSync).toHaveBeenCalledWith(expect.stringContaining('.log'), expect.stringContaining('LOG'));
    });

    it('should NOT write log file in production', () => {
      const prodEnv = createMockEnv('production');
      const prodLogger = new LoggerAdapter(prodEnv);
      prodLogger.log('ignored in prod');
      expect(fs.appendFileSync).not.toHaveBeenCalled();
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('should write to log file with stack trace', () => {
      logger.error('error msg', 'Error: stack trace here');
      expect(fs.appendFileSync).toHaveBeenCalledWith(expect.stringContaining('.log'), expect.stringContaining('ERROR'));
      expect(fs.appendFileSync).toHaveBeenCalledWith(expect.anything(), expect.stringContaining('stack trace here'));
    });

    it('should write error log even in production', () => {
      const prodEnv = createMockEnv('production');
      const prodLogger = new LoggerAdapter(prodEnv);
      prodLogger.error('critical error');
      expect(fs.appendFileSync).toHaveBeenCalledTimes(1);
    });
  });

  describe('warn', () => {
    it('should write to log file in development', () => {
      logger.warn('warning message');
      expect(fs.appendFileSync).toHaveBeenCalledWith(expect.stringContaining('.log'), expect.stringContaining('WARN'));
    });

    it('should NOT write warn log in production', () => {
      const prodEnv = createMockEnv('production');
      const prodLogger = new LoggerAdapter(prodEnv);
      prodLogger.warn('ignored warn');
      expect(fs.appendFileSync).not.toHaveBeenCalled();
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('file creation', () => {
    it('should create logs directory if it does not exist', () => {
      // First existsSync call (directory) → false, second (file) → false
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      logger.log('first log');
      expect(fs.mkdirSync).toHaveBeenCalledWith(expect.stringContaining('logs'), { recursive: true });
    });

    it('should use writeFileSync when log file does not exist yet', () => {
      // Directory exists, file does not
      (fs.existsSync as jest.Mock)
        .mockReturnValueOnce(true) // directory check
        .mockReturnValueOnce(false); // file check
      logger.log('new file');
      expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
      expect(fs.appendFileSync).not.toHaveBeenCalled();
    });

    it('should use appendFileSync when log file already exists', () => {
      // Both exist
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      logger.log('append to existing');
      expect(fs.appendFileSync).toHaveBeenCalledTimes(1);
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });
});
