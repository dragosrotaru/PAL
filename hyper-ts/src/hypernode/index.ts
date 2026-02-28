import { ID } from "../id";

interface FromData {
  data: Buffer;
}
interface FromSerialized {
  serialized: Buffer;
}
type From = FromData | FromSerialized;

export class HyperNode {
  static readonly type: Buffer = Buffer.from("0", "binary");
  readonly id: ID;
  readonly data: Buffer;
  constructor(from: From) {
    if ("data" in from) {
      this.data = from.data;
    } else {
      if (Buffer.compare(from.serialized.slice(0, 1), HyperNode.type) !== 0) {
        throw new Error("serialized data is not a HyperNode");
      }
      this.data = from.serialized.slice(1);
    }
    this.id = new ID({ data: this.serialized });
  }
  get serialized() {
    return Buffer.concat([HyperNode.type, this.data]);
  }
}
