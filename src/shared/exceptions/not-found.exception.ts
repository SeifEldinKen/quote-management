import httpStatus from 'http-status';
import BaseError from './base.exception';

export default class NotFoundException extends BaseError {
  constructor(message: string, data: any = {}, callback?: () => void) {
    super(message, httpStatus.NOT_FOUND, data, callback);
  }
}
