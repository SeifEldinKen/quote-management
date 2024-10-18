import { Request, Response, NextFunction, RequestHandler } from 'express';
import { JwtVerifyUseCase } from '@domain/use-cases/auth';
import { IBaseMiddleware } from '@shared/interfaces';
import { Logger } from '@shared/classes';
import db from '@infrastructure/database/prisma';

export default class IsAuthenticatedMiddleware implements IBaseMiddleware {
  private logger: Logger;

  constructor(private jwtVerifyUseCase = new JwtVerifyUseCase()) {
    this.logger = new Logger('is-authenticated-middleware');
  }

  handler(): RequestHandler {
    return async (req: Request, _: Response, next: NextFunction) => {
      try {
        // --> 1) check the authorization header is not empty & start with { Bearer }
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer')) {
          this.logger.error('There is no token in the header or it does not start with Bearer');
          throw new Error('Unauthorized');
        }

        // --> 2) check if token in header
        const [, accessToken] = authHeader.split('Bearer ');

        if (!accessToken) {
          this.logger.error('Unauthorized');
          throw new Error('Unauthorized');
        }

        // --> 3) verify token (no change happens, expired token)
        const usecaseRequest = {
          token: accessToken,
          secret: process.env.ACCESS_TOKEN_SECRET,
        };

        const payload = await this.jwtVerifyUseCase.execute(usecaseRequest).catch((error) => {
          if (error.name === 'TokenExpiredError') {
            this.logger.error('token expired');
            throw new Error('token invalid or expired');
          }

          this.logger.error('token invalid');
          throw new Error('token invalid or expired');
        });

        // --> 4) check if the user has not deleted their account after generating the token
        const isUserAlreadyExist = await db.user.findUnique({
          select: { id: true, passwordChangedAt: true, isBlocked: true },
          where: {
            id: payload.userId,
          },
        });

        if (isUserAlreadyExist === null) {
          this.logger.error(`this user with id: ${payload.userId} has been deleted`);
          throw new Error('this user has been deleted');
        }

        // --> 5) check that the password has not changed after creating the token
        if (isUserAlreadyExist.passwordChangedAt !== null) {
          if (isUserAlreadyExist.passwordChangedAt > payload.iat!) {
            this.logger.error('Sorry, user recently changed his password. please login again');
            throw new Error('Sorry, user recently changed his password. please login again');
          }
        }

        // --> 6) check if user is blocked
        if (isUserAlreadyExist.isBlocked) {
          this.logger.error(`this user with id: ${payload.userId} has been blocked`);
          throw new Error('this user has been blocked');
        }

        // --> 7) add user in response
        req.user = {
          id: payload.userId,
          role: payload.role,
        };

        // --> 8) next
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
