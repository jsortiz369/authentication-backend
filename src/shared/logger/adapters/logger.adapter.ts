import { Logger } from '@nestjs/common';
import path from 'node:path';
import fs from 'node:fs';

import { LoggerRepository } from '../ports/logger.repository';
import { EnvRepository } from 'src/shared/env/ports/env.repository';

export class LoggerAdapter implements LoggerRepository {
  private readonly logger: Logger;

  constructor(private readonly _envRepository$: EnvRepository) {
    this.logger = new Logger();
  }

  log(message: any, context?: string): void {
    if (context) this.logger.log(message, context);
    else this.logger.log(message);

    // create file
    this.createFileLog(typeof message === 'string' ? message : JSON.stringify(message), 'log');
  }

  error(message: any, stack?: string, context?: string) {
    if (context) this.logger.error(message, undefined, context);
    else this.logger.error(message);

    // create file
    if (typeof message !== 'string') message = JSON.stringify(message);
    this.createFileLog(stack ? `${message} ${stack}` : message, 'error');
  }

  warn(message: any, context?: string) {
    if (context) this.logger.warn(message, undefined, context);
    else this.logger.warn(message);

    this.createFileLog(typeof message === 'string' ? message : JSON.stringify(message), 'warn');
  }

  private createFileLog(text: any, type: 'error' | 'warn' | 'log' = 'log') {
    if (this._envRepository$.env('NODE_ENV') === 'production' && type !== 'error') return;

    const uploadPath = path.join(process.cwd(), 'logs');

    // validate exist folder
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

    const date = new Date().toISOString().replaceAll('/', '-');
    const filePath = path.join(uploadPath, `${date.split('T')[0]}.log`);

    const icon = type === 'error' ? '🚨' : type === 'warn' ? '⚠️' : '📝';
    const textLog = `[${date}] ${icon} ${type.toUpperCase()} ${text} \n`;
    const existFile = fs.existsSync(filePath);
    if (!existFile) fs.writeFileSync(filePath, textLog, 'utf-8');
    else fs.appendFileSync(filePath, textLog);
  }
}
