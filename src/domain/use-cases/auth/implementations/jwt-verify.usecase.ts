import { IPayload } from './jwt-generate-token.usecase';
import jwt from 'jsonwebtoken';

interface IVerifyTokenRequest {
  token: string;
  secret: string;
}

export default class JwtVerifyUseCase {
  constructor() {}

  public async execute({ token, secret }: IVerifyTokenRequest): Promise<IPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (error, decoded) => {
        if (error) {
          reject(error);
        }

        resolve(decoded as IPayload);
      });
    });
  }
}
