import { BaseException } from 'shared/exceptions';
import { ZodError } from 'zod';

export default class ErrorHandler {
  constructor() {}

  public async handle(error: Error): Promise<void> {
    //
  }

  public isTrustedError(error: Error): boolean {
    [BaseException, ZodError].forEach((exception) => {
      if (error instanceof exception) {
        return true;
      }
    });

    return false;
  }
}
