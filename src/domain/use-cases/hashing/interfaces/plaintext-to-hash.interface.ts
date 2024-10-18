export default interface IPlaintextToHash {
  execute(plaintext: string): Promise<string>;
}
