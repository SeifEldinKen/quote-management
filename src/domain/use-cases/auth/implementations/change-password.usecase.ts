import { BcryptComparePasswordToHashUseCase, BcryptPasswordToHashUseCase } from '@domain/use-cases/hashing';
import { DateTime } from 'luxon';
import db from '@infrastructure/database/prisma';

interface ChangePasswordRequest {
  currentUserId: string;
  oldPassword: string;
  newPassword: string;
}

export default class ChangePasswordUseCase {
  constructor(
    private comparePasswordToHash = new BcryptComparePasswordToHashUseCase(),
    private passwordToHash = new BcryptPasswordToHashUseCase(),
  ) {}

  public async execute({ currentUserId, oldPassword, newPassword }: ChangePasswordRequest) {
    // --> get user info from database
    const currentUser = await db.user.findUnique({
      where: { id: currentUserId },
      select: {
        passwordHash: true,
      },
    });

    // --> check if old password is correct
    const isOldPasswordCorrect = await this.comparePasswordToHash.execute(oldPassword, currentUser!.passwordHash);

    if (!isOldPasswordCorrect) {
      throw new Error('your old password is incorrect, please try again');
    }

    // --> new password cannot be the same as old password
    if (newPassword === oldPassword) {
      throw new Error('your new password cannot be the same as your old password');
    }

    // --> convert new password to hash
    const newHashedPassword = await this.passwordToHash.execute(newPassword);

    // --> update password in database
    await db.user.update({
      where: { id: currentUserId },
      data: {
        passwordHash: newHashedPassword,
        passwordChangedAt: DateTime.now().toUnixInteger(),
      },
    });
  }
}
