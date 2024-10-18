export default interface IComparePlaintextToHash {
  execute(plaintext: string, hash: string): Promise<boolean>;
}
