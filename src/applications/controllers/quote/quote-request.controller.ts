import { CreateQuoteRequestUseCase, FetchManyQuoteRequestUseCase } from '@domain/use-cases/quotes';
import { Router, Request, Response, NextFunction } from 'express';
import { IsAuthenticatedMiddleware } from 'applications/middlewares';
import { IBaseController } from '@shared/interfaces';
import httpStatus from 'http-status';

export default class QuoteRequestController implements IBaseController {
  path: string;
  router: Router;

  constructor(
    private createQuoteRequestUseCase = new CreateQuoteRequestUseCase(),
    private fetchManyQuoteRequestUseCase = new FetchManyQuoteRequestUseCase(),
  ) {
    this.path = '/quote/requests';
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

    /* POST */
    this.router.post(`${this.path}/`, [
      /* Set middlewares here */
      new IsAuthenticatedMiddleware().handler(),
      this.create,
    ]);
  }

  getMany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // --> get current user id from request
      const { id } = req.user!;

      // --> get limit and page from request
      const { limit, page } = req.query;

      // --> call get many quote request use-case
      const result = await this.fetchManyQuoteRequestUseCase.execute({
        currentUserId: id,
        pagination: {
          limit: limit ? Number(limit) : 10,
          page: page ? Number(page) : 1,
        },
      });

      // --> return response to client
      res.status(httpStatus.OK).json({
        message: 'success',
        quoteRequests: result.quoteRequests,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async ({ body }: Request, res: Response, next: NextFunction) => {
    try {
      // --> call create quote request use-case
      const result = await this.createQuoteRequestUseCase.execute({
        ...body,
      });

      // --> return response to client
      res.status(httpStatus.CREATED).json({
        message: 'quote request created successfully',
        quoteRequest: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
