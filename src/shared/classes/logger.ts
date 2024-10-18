import { createLogger, Logger as WinstonLogger, format, transports } from 'winston';

export default class Logger {
  private logger: WinstonLogger;
  private label: string;

  private levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  };

  constructor(label: string = 'DEFAULT-LABEL') {
    this.label = label;
    const logLevel = this.getLogLevel();

    this.logger = createLogger({
      level: logLevel,
      levels: this.levels,
      format: this.createFormat(),
      transports: this.createTransports(logLevel),
    });
  }

  private createFormat() {
    return format.combine(
      format.timestamp(),
      format.label({ label: this.label }),
      format.printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
      }),
    );
  }

  private createTransports(logLevel: string) {
    const transportsList: any[] = [
      new transports.Console({
        format: format.combine(format.colorize(), this.createFormat()),
      }),
    ];

    // Add file transports only in production mode
    if (logLevel !== 'debug') {
      transportsList.push(
        new transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new transports.File({
          filename: 'logs/all.log',
        }),
      );
    }

    return transportsList;
  }

  private getLogLevel() {
    const env = process.env.NODE_ENV;
    return env === 'development' ? 'debug' : 'warn';
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public error(message: string): void {
    this.logger.error(message);
  }

  public debug(message: string): void {
    this.logger.debug(message);
  }

  public http(message: string): void {
    this.logger.http(message);
  }
}
