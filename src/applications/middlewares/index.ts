import { IBaseMiddleware } from '@shared/interfaces';
import CorsMiddleware from './app/cors.middleware';
import MorganMiddleware from './app/morgan.middleware';
import ExpressJsonMiddleware from './app/express-json.middleware';
import ExpressUrlencodedMiddleware from './app/express-urlencoded.middleware';
import HelmetMiddleware from './app/helmet.middleware';
import HelmetOriginMiddleware from './app/helmet-origin.middleware';
import NotFoundHandlerMiddleware from './app/not-found.middleware';
import GlobalErrorHandlerMiddleware from './app/global-error-handler.middleware';
import ZodValidationMiddleware from './app/zod-validation.middleware';
import CookiesParserMiddleware from './app/cookies-parser.middleware';
import IsAuthenticatedMiddleware from './auth/is-authenticated.middleware';

const globalMiddlewares = Array.from<IBaseMiddleware>([
  /* Set global middlewares here */
  new CorsMiddleware(),
  new MorganMiddleware(),
  new CookiesParserMiddleware(),
  new ExpressJsonMiddleware(),
  new ExpressUrlencodedMiddleware(),
  new HelmetMiddleware(),
  new HelmetOriginMiddleware(),
]);

export {
  globalMiddlewares,
  GlobalErrorHandlerMiddleware,
  NotFoundHandlerMiddleware,
  ZodValidationMiddleware,
  IsAuthenticatedMiddleware,
};
