import { RequestHandler, json } from 'express';
import { IBaseMiddleware } from '@shared/interfaces';

export default class ExpressJsonMiddleware implements IBaseMiddleware {
  handler(): RequestHandler {
    return json({
      limit: '50mb',
    });
  }
}
