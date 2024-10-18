import IGenerateRandomToken, { IGenerateRandomTokenRequest } from '../interfaces/generate-random-token.interfaces';
import { nanoid } from 'nanoid';

export default class NanoidGenerateRandomTokenUseCase implements IGenerateRandomToken {
  public execute({ length }: IGenerateRandomTokenRequest): string {
    return nanoid(length);
  }
}
