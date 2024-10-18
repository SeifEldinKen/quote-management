import { RequestHandler, urlencoded } from 'express';
import { IBaseMiddleware } from '@shared/interfaces';

export default class ExpressUrlencodedMiddleware implements IBaseMiddleware {
  handler(): RequestHandler {
    return urlencoded({
      extended: true,
    });
  }
}
