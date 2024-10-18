import { ILoginResponse } from '@shared/interfaces';

export default interface ILogin<T> {
  execute(data: T): Promise<ILoginResponse>;
}
