import 'dotenv/config';
import { Logger, ErrorHandler } from 'shared/classes';
import { globalMiddlewares } from 'applications/middlewares';
import { NotFoundException } from 'shared/exceptions';
import { isDebuggingMode } from 'shared/utils';
import { controllers } from 'applications/controllers';
import { existsSync } from 'node:fs';
import AppServer from 'app-server';
import db from '@infrastructure/database/prisma';

const logger = new Logger('main');

async function main() {
  /* Check if .env file exists */
  if (!existsSync('.env')) {
    throw new NotFoundException('.env file not found');
  }

  /* Check if debug mode is enabled */
  if (isDebuggingMode()) {
    logger.debug(`🤖 debug mode -->  ${process.env.DEBUG}`);
  }

  const result: [{ now: Date }] = await db.$queryRaw`SELECT NOW()`;

  logger.info(`Database connected at ${result[0].now}`);

  /* Init App Server and start */
  const server = AppServer.getInstance(globalMiddlewares, controllers, {
    httpPort: process.env.HTTP_PORT,
    httpHost: process.env.HTTP_HOST,
    prefixApi: '/api/v1',
  });

  const serverListening = await server.start().then((server) => {
    logger.info(`🚀 Server is working at: http://localhost:${process.env.HTTP_PORT}/api/v1/healthz`);
    return server;
  });

  /* Shutdown Gracefully */
  const shutdown = async (signal: string) => {
    serverListening.close(() => {
      logger.info(`🛑 Signal: ${signal}`);
      logger.info('😴 server shutting down...');
      process.exit(0);
    });
  };

  const errorHandler = new ErrorHandler();

  process.on('uncaughtException', async (error: Error) => {
    await errorHandler.handle(error);

    if (!errorHandler.isTrustedError(error)) {
      process.exit(1);
    }
  });

  process.on('unhandledRejection', (error: Error) => {
    throw error;
  });

  process.on('SIGINT', () => {
    shutdown('SIGINT');
  });

  process.on('SIGTERM', () => {
    shutdown('SIGTERM');
  });
}

main().catch((error) => {
  logger.error(`⚠️ server starting crashed: ${error.message}`);
  process.exit(1);
});
