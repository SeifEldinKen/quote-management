import { IBaseController } from '@shared/interfaces';
import HealthController from './health/health.controller';
import RegistrationRequestController from './auth/registration-request.controller';
import AuthController from './auth/auth.controller';
import QuoteRequestController from './quote/quote-request.controller';
import QuoteController from './quote/quote.controller';

const controllers = Array.from<IBaseController>([
  /* Set available controllers here */
  new HealthController(),
  new RegistrationRequestController(),
  new AuthController(),
  new QuoteRequestController(),
  new QuoteController(),
]);

export { controllers };
