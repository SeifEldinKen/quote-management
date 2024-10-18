export default interface IGenerateToken<T> {
  execute(data: T): string;
}
