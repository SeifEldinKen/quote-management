export default class BaseException extends Error {
  private isOperational: boolean;
  private statusCode: number;
  private data: any;

  constructor(message: string, statusCode: number, data: object, callback?: () => void) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    if (callback) {
      callback();
    }

    this.isOperational = true;
    this.statusCode = statusCode;
    this.data = data;

    Error.captureStackTrace(this);
  }
}
