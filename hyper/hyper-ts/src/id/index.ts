import crypto from "crypto";
import varint from "varint";
const multihash = require("multihashes");

interface FromData {
  data: Buffer;
}
interface FromSerialized {
  serialized: Buffer;
}
type From = FromData | FromSerialized;

export const parseID = (
  bytes: Buffer
): { leftOver: Buffer; dataLength: number; multiHash: Buffer } => {
  if (!(bytes instanceof Uint8Array)) {
    throw new Error("multihash must be a Uint8Array");
  }
  if (bytes.length < 2) {
    throw new Error("multihash too short. must be > 2 bytes.");
  }
  // Get MultiHash Code
  const code = varint.decode(bytes);
  if (!exports.isValidCode(code)) {
    throw new Error(`multihash unknown function code: 0x${code.toString(16)}`);
  }
  // Get Multihash Length
  bytes = bytes.slice(varint.decode.bytes);
  const digestLength = varint.decode(bytes);
  if (digestLength < 0) {
    throw new Error(`multihash invalid length: ${digestLength}`);
  }
  // Get Multihash Digest
  bytes = bytes.slice(varint.decode.bytes);
  const digest = bytes.slice(0, digestLength);
  if (digest.length !== digestLength) {
    throw new Error("multihash length inconsistent");
  }
  // Get Data Length
  const dataLength = varint.decode(bytes.slice(digestLength));
  const mHash = multihash.encode(digest, code, digestLength);
  return { leftOver: bytes, dataLength, multiHash: mHash };
};

export class ID {
  readonly _HASHING_ALGORITHM = "sha256";
  readonly _HASHING_ALGORITHM_MULTIHASH = "sha2-256";
  readonly multiHash: Buffer;
  readonly bytes: number;
  constructor(from: From) {
    if ("data" in from) {
      const hash = crypto.createHash(this._HASHING_ALGORITHM);
      hash.update(from.data);
      this.multiHash = multihash.encode(
        hash.digest(),
        this._HASHING_ALGORITHM_MULTIHASH
      );
      this.bytes = from.data.byteLength;
    } else {
      let bytes = from.serialized;
      const { leftOver, dataLength, multiHash } = parseID(bytes);
      this.bytes = dataLength;
      this.multiHash = multiHash;
      if (leftOver.byteLength !== 0) {
        throw new Error("ID length inconsistent");
      }
    }
  }
  get serialized() {
    return Buffer.concat([
      this.multiHash,
      varint.encode(this.bytes, Buffer.from([])),
    ]);
  }
}
