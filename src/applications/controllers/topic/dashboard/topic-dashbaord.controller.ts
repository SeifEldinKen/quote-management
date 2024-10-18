import { Router, Request, Response, NextFunction } from 'express';
import { IBaseController } from '@shared/interfaces';
import { IsAuthenticatedMiddleware } from 'applications/middlewares';

export default class TopicDashboardController implements IBaseController {
  path: string;
  router: Router;

  constructor() {
    this.path = '/dashboard/topics';
    this.router = Router();

    this.initRoutes();
  }

  initRoutes(): void {
    /* GET */
    this.router.get(`${this.path}/`, [
      /* Set middlewares here */
      new IsAuthenticatedMiddleware().handler(),
      this.getMany,
    ]);

    this.router.get(`${this.path}/:id`, [
      /* Set middlewares here */
      new IsAuthenticatedMiddleware().handler(),
      this.getSpecific,
    ]);

    /* POST */
    this.router.post(`${this.path}/`, [
      /* Set middlewares here */
      new IsAuthenticatedMiddleware().handler(),
      this.create,
    ]);

    /* PUT */
    /* DELETE */
  }

  private getSpecific = async (req: Request, res: Response, next: NextFunction) => {
    try {
      //
    } catch (error) {
      next(error);
    }
  };

  private getMany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      //
    } catch (error) {
      next(error);
    }
  };

  private create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      //
    } catch (error) {
      next(error);
    }
  };

  private update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      //
    } catch (error) {
      next(error);
    }
  };

  private delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      //
    } catch (error) {
      next(error);
    }
  };
}
