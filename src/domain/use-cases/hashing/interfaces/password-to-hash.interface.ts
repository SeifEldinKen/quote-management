export default interface IPasswordToHash {
  execute(plaintextPassword: string): Promise<string>;
}
