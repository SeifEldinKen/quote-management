import { BcryptComparePasswordToHashUseCase, IComparePasswordHash } from '@domain/use-cases/hashing';
import { ILoginResponse } from '@shared/interfaces';
import { Logger } from '@shared/classes';
import JwtGenerateTokenUseCase from './jwt-generate-token.usecase';
import ILogin from '../interfaces/login.interface';
import db from '@infrastructure/database/prisma';
import ms from 'ms';

interface ILoginWithEmailAndPasswordProps {
  userAgent: string;
  email: string;
  password: string;
}

export default class LoginWithEmailAndPasswordUseCase implements ILogin<ILoginWithEmailAndPasswordProps> {
  private logger: Logger;

  constructor(
    private generateTokenUseCase = new JwtGenerateTokenUseCase(),
    private comparePasswordToHash: IComparePasswordHash = new BcryptComparePasswordToHashUseCase(),
  ) {
    this.logger = new Logger('login-with-email-and-password-use-case');
  }

  async execute({ userAgent, email, password }: ILoginWithEmailAndPasswordProps): Promise<ILoginResponse> {
    // --> check if email exits in database
    const currentUser = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        passwordHash: true,
        username: true,
        email: true,
        role: true,
        profilePicKey: true,
      },
    });

    if (currentUser === null) {
      this.logger.error(`email or password is incorrect: ${email}`);
      throw new Error('email or password is incorrect');
    }

    // --> check if password is correct
    const isPasswordCorrect = await this.comparePasswordToHash.execute(password, currentUser!.passwordHash);

    if (!isPasswordCorrect) {
      this.logger.error(`email or password is incorrect: ${email}`);
      throw new Error('email or password is incorrect');
    }

    // --> create access token and refresh token
    const accessToken = this.generateTokenUseCase.execute({
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      payload: {
        userId: currentUser!.id,
        role: currentUser!.role,
      },
    });

    const refreshToken = this.generateTokenUseCase.execute({
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
      payload: {
        userId: currentUser!.id,
        role: currentUser!.role,
      },
    });

    // --> check if there is a session on the same device

    // --> create session
    const expiresAt = new Date(
      /* current time + refresh token expires in */
      Date.now() + ms(process.env.REFRESH_TOKEN_EXPIRES_IN),
    );

    await db.session.create({
      data: {
        userId: currentUser.id,
        userAgent,
        refreshToken,
        expiresAt,
      },
    });

    return {
      user: {
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
        profilePicKey: currentUser.profilePicKey,
        role: currentUser.role,
      },
      tokens: {
        access: accessToken,
        refresh: refreshToken,
      },
    };
  }
}
