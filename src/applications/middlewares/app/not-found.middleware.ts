import { Request, Response, NextFunction, RequestHandler } from 'express';
import { NotFoundException } from '../../../shared/exceptions';
import { IBaseMiddleware } from '@shared/interfaces';

export default class NotFoundHandlerMiddleware implements IBaseMiddleware {
  constructor() {}
  handler(): RequestHandler {
    return (_: Request, res: Response, next: NextFunction) => {
      return next(
        new NotFoundException('Ooh you are lost, read the the API documentations to find your way back home 😂'),
      );
    };
  }
}
