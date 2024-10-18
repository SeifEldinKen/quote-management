import { IComparePlaintextToHash, PBkdf2ComparePlaintextToHashUseCase } from '../../hashing';
import { Logger } from '@shared/classes';
import db from '@infrastructure/database/prisma';

interface IVerifyRequestRegistrationProps {
  email: string;
  token: string;
}

export default class VerifyRegistrationRequestUseCase {
  private logger: Logger;

  constructor(
    private comparePlaintextToHashUseCase: IComparePlaintextToHash = new PBkdf2ComparePlaintextToHashUseCase(),
  ) {
    this.logger = new Logger('verify-registration-request-use-case');
  }

  public async execute({ email, token }: IVerifyRequestRegistrationProps) {
    // --> 1) check if request exists
    const request = await db.registrationRequest.findUnique({
      select: { id: true, expiresAt: true, tokenHash: true, username: true, passwordHash: true },
      where: {
        email,
        redeemAt: null,
      },
    });

    if (request === null) {
      this.logger.error(`Registration request not found for email: ${email}`);
      throw new Error('registration request not found');
    }

    // --> 3) check if token is valid
    const isTokenValid = await this.comparePlaintextToHashUseCase.execute(token, request.tokenHash);

    if (!isTokenValid) {
      this.logger.error(`Invalid token for email: ${email}`);
      throw new Error('token is invalid');
    }

    // --> 4) check if token is expired
    if (new Date() > request.expiresAt) {
      this.logger.error(`Token expired for email: ${email}`);
      throw new Error('token is expired');
    }

    // --> update request registration redeem
    await db.registrationRequest.update({
      where: { email },
      data: {
        redeemAt: new Date(),
      },
    });

    // --> 5) create user
    await db.user.create({
      select: { id: true },
      data: {
        email,
        username: request.username,
        passwordHash: request.passwordHash,
      },
    });
  }
}
