import crypto from "crypto";

/**
 * A hash-based content-addressed identifier.
 * Accepts `{ data: Buffer }` and produces a SHA-256 digest.
 * The `bytes` property exposes the byte length of the hashed data
 * (used by the FUSE layer to report file size).
 */
export class HashID {
  public readonly digest: Buffer;
  /** Byte length of the original data that was hashed. */
  public readonly bytes: number;

  constructor({ data }: { data: Buffer }) {
    this.bytes = data.length;
    this.digest = crypto.createHash("sha256").update(data).digest();
  }

  toString(): string {
    return this.digest.toString("hex");
  }
}
