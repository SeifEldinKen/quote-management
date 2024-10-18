import { GlobalErrorHandlerMiddleware, NotFoundHandlerMiddleware } from 'applications/middlewares';
import { IBaseController, IBaseMiddleware, IExpressServerConfig } from 'shared/interfaces';
import express, { Application } from 'express';
import { Server as HttpServer } from 'http';

export default class AppServer {
  private static instance: AppServer | null = null;
  private config: IExpressServerConfig;
  private app: Application;
  private httpServer: HttpServer;

  private constructor(middlewares: IBaseMiddleware[], controllers: IBaseController[], config: IExpressServerConfig) {
    this.config = config;
    this.app = express();
    this.httpServer = new HttpServer(this.app);

    this.expressSettings();
    this.initializeMiddlewares(middlewares);
    this.initializeControllers(controllers);
    this.initErrorHandler();
  }

  public static getInstance(
    middlewares: Array<IBaseMiddleware>,
    controllers: Array<IBaseController>,
    config: IExpressServerConfig,
  ) {
    if (this.instance === null) {
      this.instance = new AppServer(middlewares, controllers, config);
    }
    return this.instance;
  }

  private expressSettings() {
    this.app.disable('x-powered-by');
    this.app.set('trust proxy', 1);
  }

  private initializeMiddlewares(middlewares: Array<IBaseMiddleware>) {
    middlewares.forEach((middleware) => {
      this.app.use(middleware.handler());
    });
  }

  private initializeControllers(controllers: Array<IBaseController>) {
    controllers.forEach((controller) => {
      this.app.use(this.config.prefixApi, controller.router);
    });
  }

  private initErrorHandler() {
    this.app.all('*', new NotFoundHandlerMiddleware().handler());
    this.app.use(new GlobalErrorHandlerMiddleware().handler());
  }

  public async start(): Promise<HttpServer> {
    return new Promise((resolve, reject) => {
      this.httpServer.listen(this.config.httpPort, this.config.httpHost, () => {
        resolve(this.httpServer);
      });

      this.httpServer.on('error', (error) => {
        reject(error);
      });
    });
  }

  public getHttpServer() {
    return this.httpServer;
  }
}
