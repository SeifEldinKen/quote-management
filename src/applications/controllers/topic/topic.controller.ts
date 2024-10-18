import { IBaseController } from '@shared/interfaces';
import { Router } from 'express';

export default class TopicController implements IBaseController {
  path: string;
  router: Router;

  constructor() {
    this.path = '/topics';
    this.router = Router();

    this.initRoutes();
  }

  initRoutes(): void {
    throw new Error('Method not implemented.');
  }
}
