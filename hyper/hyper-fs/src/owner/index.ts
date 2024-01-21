import { SymmetricKey } from "../../../../common/src/models/value-objects/symmetric-key";
import type { DeviceConfig } from "../device/config";
import type { FileEncryption } from "../file/encryption";
import type { Password } from "../password";

export class Owner {
  private readonly symmetricKey: SymmetricKey;
  constructor(password: Password, config: DeviceConfig) {
    this.symmetricKey = SymmetricKey.deriveFromPassword(password, config.salt);
  }
  encrypt(data: Buffer): [Buffer, FileEncryption] {
    return [this.symmetricKey.encrypt(data), this.symmetricKey.ALGORITHM];
  }
  decrypt(data: Buffer): Buffer {
    return this.symmetricKey.decrypt(data);
  }
}
