import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

export default class GlobalErrorHandlerMiddleware  {
  constructor() {}

  handler() {
    return (error: any, req: Request, res: Response, next: NextFunction) => {
      res.status(error.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: error.statusCode,
        message: error.message,
        data: error.data,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    };
  }
}
