import { RequestHandler, Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export default class IsAuthorizedMiddleware {
  handler(roles: Role[]): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        // --> get user role from local request
        const { role } = req.user!;

        // --> check if the user is allowed to go through this route
        if (!roles.includes(role)) {
          next(new Error('you are not allowed to access this route'));
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
