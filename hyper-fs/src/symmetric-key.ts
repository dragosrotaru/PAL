import crypto from "crypto";
import type { Password } from "./password";
import type { FileEncryption } from "./file/encryption";

// TODO: implement real AES-256-GCM key derivation and encryption.
export class SymmetricKey {
  public readonly ALGORITHM: FileEncryption = "aes-256-gcm";
  private readonly key: Buffer;

  private constructor(key: Buffer) {
    this.key = key;
  }

  /** Derive a symmetric key from a password and a salt string using PBKDF2. */
  static deriveFromPassword(password: Password, salt: string): SymmetricKey {
    const key = crypto.pbkdf2Sync(password.toString(), salt, 100_000, 32, "sha256");
    return new SymmetricKey(key);
  }

  encrypt(data: Buffer): Buffer {
    // TODO: real AES-256-GCM encryption with IV/auth-tag
    return data;
  }

  decrypt(data: Buffer): Buffer {
    // TODO: real AES-256-GCM decryption
    return data;
  }
}
