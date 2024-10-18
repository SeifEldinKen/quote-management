import { CreateRegistrationRequestUseCase, VerifyRegistrationRequestUseCase } from '@domain/use-cases/auth';
import { NextFunction, Request, Response, Router } from 'express';
import { IBaseController } from 'shared/interfaces';
import httpStatus from 'http-status';

export default class RegistrationRequestController implements IBaseController {
  path: string;
  router: Router;

  constructor(
    private createRegistrationRequestUseCase = new CreateRegistrationRequestUseCase(),
    private verifyRegistrationRequestUseCase = new VerifyRegistrationRequestUseCase(),
  ) {
    this.path = '/auth/registration-requests';
    this.router = Router();

    this.initRoutes();
  }

  initRoutes(): void {
    /* POST */
    this.router.post(`${this.path}/`, [
      /* Set middlewares here */
      this.create,
    ]);

    /* PUT */
    this.router.put(`${this.path}/verify`, [
      /* Set middlewares here */
      this.verifyRegistrationRequest,
    ]);
  }

  create = async ({ body }: Request, res: Response, next: NextFunction) => {
    try {
      // --> get data from request body
      const { email, username, password } = body;

      // --> create registration request
      await this.createRegistrationRequestUseCase.execute({
        email,
        username,
        password,
      });

      // --> send response to client
      res.status(httpStatus.CREATED).json({
        message: 'registration request created successfully, please check your email',
      });
    } catch (error) {
      next(error);
    }
  };

  private verifyRegistrationRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // --> get data from request body
      const { email, token } = req.query;

      // --> verify registration request
      await this.verifyRegistrationRequestUseCase.execute({
        email: `${email}`,
        token: `${token}`,
      });

      // --> send response to client
      res.status(httpStatus.OK).json({
        message: 'verified email successfully, you can login now',
      });
    } catch (error) {
      next(error);
    }
  };
}
