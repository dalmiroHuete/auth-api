import { Logger as NestLogger } from '@nestjs/common';

export class Logger {
  private static logger = new NestLogger('App');

  static log(message: string, context?: string) {
    this.logger.log(message, context);
  }

  static error(message: string, trace?: string, context?: string) {
    this.logger.error(message, trace, context);
  }

  static warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }

  static debug(message: string, context?: string) {
    this.logger.debug(message, context);
  }
} 