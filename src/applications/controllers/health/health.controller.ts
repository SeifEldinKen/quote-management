import { Router, Request, Response, NextFunction } from 'express';
import { IBaseController } from 'shared/interfaces';
import httpStatus from 'http-status';

export default class HealthController implements IBaseController {
  path: string;
  router: Router;

  constructor() {
    this.path = '/healthz';
    this.router = Router();

    this.initRoutes();
  }

  initRoutes(): void {
    this.router.get(`${this.path}/`, [
      // set middlewares here
      this.healthz,
    ]);
  }

  private healthz(_: Request, res: Response, next: NextFunction) {
    try {
      res.status(httpStatus.OK).json({
        message: 'server is up and working',
      });
    } catch (error) {
      next(error);
    }
  }
}
