import db from '@infrastructure/database/prisma';

interface LogoutRequest {
  currentUser: string;
  refreshToken: string;
  accessToken: string;
}

export default class LogoutUseCase {
  public constructor() {}

  public async execute({ currentUser, refreshToken, accessToken }: LogoutRequest): Promise<void> {
    await db.$transaction(async (tx) => {
      // --> remove session from database
      await tx.session.deleteMany({
        where: {
          userId: currentUser,
          refreshToken,
        },
      });

      // --> set refresh and access to blacklisted
      await tx.tokenBlacklist.create({
        data: {
          accessToken,
          refreshToken,
        },
      });
    });
  }
}
