import httpStatus from 'http-status';
import BaseError from './base.exception';

export default class ConflictException extends BaseError {
  constructor(message: string, data: any = {}, callback?: () => void) {
    super(message, httpStatus.CONFLICT, data, callback);
  }
}
