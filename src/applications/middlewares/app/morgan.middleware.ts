import morgan, { StreamOptions } from 'morgan';
import { IBaseMiddleware } from '@shared/interfaces';
import { RequestHandler } from 'express';
import { Logger } from '../../../shared/classes';

export default class MorganMiddleware implements IBaseMiddleware {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('HTTP-MORGAN');
  }

  private stream: StreamOptions = {
    write: (message: string) => {
      this.logger.http(message.trim());
    },
  };

  private skip() {
    const env = process.env.NODE_ENV;
    return env !== 'development';
  }

  handler(): RequestHandler {
    return morgan(':method :url :status :res[content-length] - :response-time ms', {
      stream: this.stream,
      skip: this.skip,
    });
  }
}
