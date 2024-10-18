import { MailTrapMailProvider } from '@shared/providers';
import { IMailProvider } from '@shared/providers';
import { DateTime } from 'luxon';
import { Logger } from '@shared/classes';
import {
  BcryptPasswordToHashUseCase,
  IGenerateRandomToken,
  IPasswordToHash,
  NanoidGenerateRandomTokenUseCase,
  Pbkdf2PlaintextToHashUseCase,
} from '../../hashing';
import db from '@infrastructure/database/prisma';

interface CreateRegistrationRequest {
  email: string;
  username: string;
  password: string;
}

export default class CreateRegistrationRequestUseCase {
  private logger: Logger;

  constructor(
    private passwordToHashUseCase: IPasswordToHash = new BcryptPasswordToHashUseCase(),
    private generateRandomTokenUseCase: IGenerateRandomToken = new NanoidGenerateRandomTokenUseCase(),
    private plaintextToHashUseCase = new Pbkdf2PlaintextToHashUseCase(),
    private mailProvider: IMailProvider = new MailTrapMailProvider(),
  ) {
    this.logger = new Logger('create-registration-request-use-case');
  }

  public async execute({ email, username, password }: CreateRegistrationRequest) {
    // --> check if email, username already exists in database
    const [isEmailExisting, isUsernameExisting] = await Promise.all([
      db.user.findUnique({ select: { id: true }, where: { email } }),
      db.user.findUnique({ select: { id: true }, where: { username } }),
    ]);

    if (isEmailExisting !== null) {
      throw new Error('you are not allowed to register with this email, try registering with another email');
    }

    if (isUsernameExisting !== null) {
      throw new Error('you are not allowed to register with this username, try registering with another email');
    }

    // --> check if registration request already exists in database, if exists, delete
    const isRegistrationRequestExisting = await db.registrationRequest.findUnique({
      select: { id: true },
      where: {
        email,
      },
    });

    if (isRegistrationRequestExisting !== null) {
      // --> delete registration request
      await db.registrationRequest.delete({
        where: {
          email,
        },
      });
    }

    // --> plaintext password to hash
    const passwordHash = await this.passwordToHashUseCase.execute(password);

    // --> generate token
    const randomToken = this.generateRandomTokenUseCase.execute({
      length: 32,
    });

    const tokenHash = await this.plaintextToHashUseCase.execute(randomToken);

    // --> create registration request
    await db.registrationRequest.create({
      data: {
        email,
        username,
        passwordHash,
        tokenHash,
        expiresAt: DateTime.now().plus({ minute: 10 }).toJSDate(),
      },
    });

    // --> send email
    try {
      // await this.mailProvider.sendMail({
      //   to: {
      //     name: username,
      //     email,
      //   },
      //   from: {
      //     name: 'Auth Service',
      //     email: '',
      //   },
      //   subject: 'Registration Request',
      //   body: /* HTML */ `
      //     <p>Hello ${username},</p>
      //     <p>
      //       Thank you for registering with Auth Service. Please use this token to verify your account: ${randomToken}
      //     </p>
      //     <p>If you did not register with Auth Service, please ignore this email.</p>
      //   `,
      // });

      if (process.env.NODE_ENV !== 'production') {
        this.logger.info(`registration request created for: ${email}, your token is: ${randomToken}`);
      }
    } catch (error) {
      this.logger.error(`Error sending registration request email: ${(error as Error).message}`);

      // --> delete registration request
      await db.registrationRequest.deleteMany({
        where: {
          email,
        },
      });

      throw error;
    }
  }
}
