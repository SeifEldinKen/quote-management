import { Logger } from '@shared/classes';
import JwtGenerateTokenUseCase from './jwt-generate-token.usecase';
import JwtVerifyUseCase from './jwt-verify.usecase';
import db from '@infrastructure/database/prisma';

interface IRefreshTokenRequest {
  accessToken: string;
  refreshToken: string;
}

export default class RefreshTokenUseCase {
  private logger: Logger;

  constructor(
    private jwtVerifyUseCase = new JwtVerifyUseCase(),
    private generateTokenUseCase = new JwtGenerateTokenUseCase(),
  ) {
    this.logger = new Logger('refresh-token-use-case');
  }

  public async execute({ accessToken, refreshToken }: IRefreshTokenRequest) {
    // --> verify refresh token
    const usecaseRequest = {
      token: refreshToken,
      secret: process.env.REFRESH_TOKEN_SECRET,
    };

    const payload = await this.jwtVerifyUseCase.execute(usecaseRequest).catch((error) => {
      if (error.name === 'TokenExpiredError') {
        this.logger.error('token expired');
        throw new Error('token invalid or expired');
      }

      this.logger.error('token invalid');
      throw new Error('token invalid or expired');
    });

    // --> generate new access token and refresh token
    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.generateTokenUseCase.execute({
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        payload: {
          userId: payload.userId,
          role: payload.role,
        },
      }),
      this.generateTokenUseCase.execute({
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        payload: {
          userId: payload.userId,
          role: payload.role,
        },
      }),
    ]);

    await db.$transaction(async (tx) => {
      // --> update session
      await tx.session.updateMany({
        where: {
          userId: payload.userId,
          refreshToken,
        },
        data: {
          refreshToken: newRefreshToken,
          expiresAt: new Date(),
        },
      });

      // --> set access token and refresh token to blacklisted
      await tx.tokenBlacklist.create({
        data: {
          // accessToken,
          refreshToken,
        },
      });
    });

    // --> return new access token and refresh token
    return {
      newAccessToken,
      newRefreshToken,
    };
  }
}
