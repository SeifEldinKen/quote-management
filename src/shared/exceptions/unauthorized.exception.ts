import httpStatus from 'http-status';
import BaseError from './base.exception';

export default class UnauthorizedException extends BaseError {
  constructor(message: string, data: any = {}, callback?: () => void) {
    super(message, httpStatus.UNAUTHORIZED, data, callback);
  }
}
