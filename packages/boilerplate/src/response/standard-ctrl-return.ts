export class StandardCtrlReturn<T = any> {
  constructor({ message, data }: { message: string; data: T }) {
    this.message = message;
    this.data = data;
  }

  public message: string;
  public data: T;
}
