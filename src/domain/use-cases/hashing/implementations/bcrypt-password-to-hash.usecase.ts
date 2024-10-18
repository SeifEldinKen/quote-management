import IPasswordToHash from '../interfaces/password-to-hash.interface';
import { Logger } from '@shared/classes';
import { hash } from 'bcrypt';

export default class BcryptPasswordToHashUseCase implements IPasswordToHash {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('bcrypt-password-to-hash-use-case');
  }

  public async execute(plaintextPassword: string): Promise<string> {
    const salt = Number(process.env.PASSWORD_SALT_ROUNDS);
    this.logger.debug(`password salt rounds: ${salt}`);

    return await hash(`${plaintextPassword}`, salt).catch((error) => {
      this.logger.error(`password to hash conversion failed: ${error.message}`);
      throw error;
    });
  }
}
