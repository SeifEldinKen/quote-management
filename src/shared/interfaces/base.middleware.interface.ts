import type { RequestHandler } from 'express';

export default interface IBaseMiddleware {
  handler(): RequestHandler;
}
