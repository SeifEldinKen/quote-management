import httpStatus from 'http-status';
import BaseError from './base.exception';

export default class BadRequestException extends BaseError {
  constructor(message: string, data: any = {}, callback?: () => void) {
    super(message, httpStatus.BAD_REQUEST, data, callback);
  }
}
