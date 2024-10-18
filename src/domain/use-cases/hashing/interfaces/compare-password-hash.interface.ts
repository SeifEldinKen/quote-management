export default interface IComparePasswordHash {
  execute(passwordPlaintext: string, hash: string): Promise<boolean>;
}
