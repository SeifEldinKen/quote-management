import { compare } from 'bcrypt';
import { Logger } from '@shared/classes';
import IComparePasswordHash from '../interfaces/compare-password-hash.interface';

export default class BcryptComparePasswordToHashUseCase implements IComparePasswordHash {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('bcrypt-compare-password-to-hash-use-case');
  }

  public async execute(passwordPlaintext: string, hash: string): Promise<boolean> {
    return await compare(passwordPlaintext, hash).catch((error) => {
      this.logger.error(`Error comparing password: ${error.message}`);
      throw error;
    });
  }
}
