import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export default class ZodValidationMiddleware {
  constructor() {}

  static init = <T>(schema: ZodSchema<T>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const validated = await schema.safeParseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (!validated.success) {
        return next(validated.error);
      }

      next();
    };
  };
}
