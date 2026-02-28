import { ParsingError } from "../../parsing-error";

export class DeviceID {
  public readonly value: string;
  // TODO uuid
  constructor(nodeID: string = "") {
    this.value = nodeID;
  }
  serialize() {
    return this.value;
  }
  static parse(input: unknown) {
    if (typeof input !== "string") {
      throw new ParsingError(`${DeviceID.name} expected string`);
    }
    return new DeviceID(input);
  }
}
