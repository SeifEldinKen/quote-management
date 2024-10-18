import { IBaseMiddleware } from '@shared/interfaces';
import { RequestHandler } from 'express';
import helmet from 'helmet';

export default class HelmetMiddleware implements IBaseMiddleware {
  constructor() {}

  handler(): RequestHandler {
    return helmet();
  }
}
