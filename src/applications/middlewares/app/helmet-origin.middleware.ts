import { crossOriginResourcePolicy } from 'helmet';
import { IBaseMiddleware } from '@shared/interfaces';
import { RequestHandler } from 'express';

export default class HelmetOriginMiddleware implements IBaseMiddleware {
  constructor() {}

  handler(): RequestHandler {
    return crossOriginResourcePolicy({
      policy: 'cross-origin',
    });
  }
}
