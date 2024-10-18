import { IBaseMiddleware } from '@shared/interfaces';
import { RequestHandler } from 'express';
import cors from 'cors';

export default class CorsMiddleware implements IBaseMiddleware {
  handler(): RequestHandler {
    return cors({
      origin: '*',
      credentials: true,
    });
  }
}
