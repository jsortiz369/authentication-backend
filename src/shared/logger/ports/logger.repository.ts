export abstract class LoggerRepository {
  abstract log(message: any, context?: string): void;

  abstract error(message: any, trace?: string, context?: string): void;

  abstract warn(message: any, context?: string): void;
}
