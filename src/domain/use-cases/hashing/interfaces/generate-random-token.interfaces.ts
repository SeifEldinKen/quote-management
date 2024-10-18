export interface IGenerateRandomTokenRequest {
  length: number;
}

export default interface IGenerateRandomToken {
  execute({ length }: IGenerateRandomTokenRequest): string;
}
