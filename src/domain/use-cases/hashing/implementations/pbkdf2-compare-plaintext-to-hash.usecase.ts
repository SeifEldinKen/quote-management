import { promisify } from 'util';
import { pbkdf2 } from 'crypto';
import { Logger } from '@shared/classes';
import IComparePlaintextToHash from '../interfaces/compare-plaintext-to-hash.interface';

export default class PBkdf2ComparePlaintextToHashUseCase implements IComparePlaintextToHash {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('pbkdf2-compare-plaintext-to-hash-use-case');
  }

  async execute(plaintext: string, hash: string): Promise<boolean> {
    const pbkdf2Async = promisify(pbkdf2);

    const [algorithm, iterations, salt, key] = hash.split('$');

    this.logger.debug(`algorithm: ${algorithm}, iterations: ${iterations}, salt: ${salt}, key: ${key}`);

    const derivedKey = await pbkdf2Async(plaintext, salt!, Number(iterations), 64, 'sha512').catch((error) => {
      throw error;
    });

    return key === derivedKey.toString('hex');
  }
}
