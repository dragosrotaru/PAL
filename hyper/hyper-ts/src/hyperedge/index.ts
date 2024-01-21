import varint from "varint";
import { ID, parseID } from "../id";

interface FromData {
  data: ID[];
}
interface FromSerialized {
  serialized: Buffer;
}
type From = FromData | FromSerialized;

export class HyperEdge {
  static readonly type: Buffer = Buffer.from("1", "binary");
  readonly id: ID;
  readonly data: ID[];
  constructor(from: From) {
    if ("data" in from) {
      this.data = from.data;
    } else {
      if (Buffer.compare(from.serialized.slice(0, 1), HyperEdge.type) !== 0) {
        throw new Error("serialized data is not a HyperEdge");
      }
      let bytes = from.serialized;
      this.data = [];
      let incomplete = true;
      while (incomplete) {
        const { leftOver, dataLength, multiHash } = parseID(bytes);
        const serializedID = Buffer.concat([
          multiHash,
          varint.encode(dataLength, Buffer.from([])),
        ]);
        const id = new ID({ serialized: serializedID });
        this.data.push(id);
        bytes = leftOver;
        if (leftOver.length === 0) {
          incomplete = false;
        }
      }
    }
    this.id = new ID({ data: this.serialized });
  }
  get serialized(): Buffer {
    return Buffer.concat([
      HyperEdge.type,
      ...this.data.map((id) => id.serialized),
    ]);
  }
}
