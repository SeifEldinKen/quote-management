import { pbkdf2, randomBytes } from 'crypto';
import { promisify } from 'util';
import { Logger } from '@shared/classes';
import IPlaintextToHash from '../interfaces/plaintext-to-hash.interface';

export default class PBkdf2PlaintextToHashUseCase implements IPlaintextToHash {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('pbkdf2-plaintext-to-hash-use-case');
  }

  async execute(plaintext: string): Promise<string> {
    const pbkdf2Async = promisify(pbkdf2);

    const salt = randomBytes(16).toString('hex');

    const derivedKey = await pbkdf2Async(plaintext, salt, 100000, 64, 'sha512').catch((error) => {
      this.logger.error(`Error hashing password: ${error.message}`);
      throw error;
    });

    const key = `pbkdf2-sha512$100000$${salt}$${derivedKey.toString('hex')}`;

    return key;
  }
}
