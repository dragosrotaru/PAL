/** Wraps a raw password string as a typed value object. */
export class Password {
  public readonly value: string;
  constructor(value: string) {
    this.value = value;
  }
  toString(): string {
    return this.value;
  }
}
