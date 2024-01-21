import { ParsingError } from "../../parsing-error";

export class StorageBackendID {
  public readonly value: string;
  // TODO uuid
  constructor(id: string = "") {
    this.value = id;
  }
  serialize() {
    return this.value;
  }
  static parse(input: unknown) {
    if (typeof input !== "string") {
      throw new ParsingError(`${StorageBackendID.name} expected string`);
    }
    return new StorageBackendID(input);
  }
}
