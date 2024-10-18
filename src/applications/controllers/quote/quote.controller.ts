import { Router, Request, Response, NextFunction } from 'express';
import { IsAuthenticatedMiddleware } from 'applications/middlewares';
import { IBaseController } from '@shared/interfaces';

export default class QuoteController implements IBaseController {
  path: string;
  router: Router;

  constructor() {
    this.path = '/quotes';
    this.router = Router();

    this.initRoutes();
  }

  initRoutes(): void {
    /* GET */
    this.router.get(`${this.path}/`, [
      /* Set middlewares here */
      new IsAuthenticatedMiddleware().handler(),
      this.getSpecific,
    ]);

    // this.router.get(`${this.path}`, [
    //   /* Set middlewares here */
    //   new IsAuthenticatedMiddleware().handler(),
    //   this.getManyRequests,
    // ]);

    this.router.get(`${this.path}`, [
      /* Set middlewares here */
      new IsAuthenticatedMiddleware().handler(),
      this.getMany,
    ]);

    /* POST */
    this.router.post(`${this.path}/`, [
      /* Set middlewares here */
      new IsAuthenticatedMiddleware().handler(),
      this.createRequest,
    ]);

    /* PUT */
    this.router.put(`${this.path}/:id`, [
      /* Set middlewares here */
      new IsAuthenticatedMiddleware().handler(),
      this.updateSpecific,
    ]);

    /* DELETE */
    this.router.delete(`${this.path}`, [
      /* Set middlewares here */
      new IsAuthenticatedMiddleware().handler(),
      this.deleteMany,
    ]);
  }

  getSpecific = async ({ params }: Request, res: Response, next: NextFunction) => {
    try {
      // --> return response to client
      res.status(200).json({
        message: 'success',
        quote: {},
      });
    } catch (error) {
      next(error);
    }
  };

  getMany = async ({ params }: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        message: 'success',
        quote: [],
      });
    } catch (error) {
      next(error);
    }
  };

  getManyRequests = async ({ params }: Request, res: Response, next: NextFunction) => {
    try {
      //
    } catch (error) {
      next(error);
    }
  };

  createRequest = async ({ body }: Request, res: Response, next: NextFunction) => {
    try {
      //
    } catch (error) {
      next(error);
    }
  };

  updateSpecific = async ({ params, body }: Request, res: Response, next: NextFunction) => {
    try {
      //
    } catch (error) {
      next(error);
    }
  };

  deleteMany = async ({ body }: Request, res: Response, next: NextFunction) => {
    try {
      //
    } catch (error) {
      next(error);
    }
  };
}
