export class ValidatorException<T> {
  constructor(public key: keyof T, public message: string) {}
  public toString = () => this.message;
}