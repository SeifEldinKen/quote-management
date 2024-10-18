import jwt, { JwtPayload } from 'jsonwebtoken';
import { Role } from '@prisma/client';
import IGenerateToken from '../interfaces/generate-token.interface';

export interface IPayload extends JwtPayload {
  userId: string;
  role: Role;
}

interface IGenerateTokenProps {
  payload: IPayload;
  secret: string;
  expiresIn: string;
}

export default class JwtGenerateTokenUseCase implements IGenerateToken<IGenerateTokenProps> {
  constructor() {}

  execute({ payload, secret, expiresIn }: IGenerateTokenProps): string {
    return jwt.sign(payload, secret, {
      expiresIn,
    });
  }
}
