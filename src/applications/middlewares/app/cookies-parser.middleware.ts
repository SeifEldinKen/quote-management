import { IBaseMiddleware } from '@shared/interfaces';
import { RequestHandler } from 'express';
import cookiesParser from 'cookie-parser';

export default class CookiesParserMiddleware implements IBaseMiddleware {
  handler(): RequestHandler {
    return cookiesParser();
  }
}
