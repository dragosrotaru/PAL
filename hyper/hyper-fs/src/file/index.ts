import { NO_COMPRESSION, FileCompression } from "./compression";
import { AES_256_GCM, FileEncryption } from "./encryption";
import { FileVersioning, NO_VERSIONING } from "./versioning";
import { FileID } from "./id";

export class File {
  public readonly data: Buffer;
  public readonly id: FileID;
  public readonly versioning: FileVersioning;
  public readonly compression: FileCompression;
  public readonly encryption: FileEncryption;
  constructor(
    data: Buffer,
    versioning: FileVersioning = NO_VERSIONING,
    compression: FileCompression = NO_COMPRESSION,
    encryption: FileEncryption = AES_256_GCM
  ) {
    this.data = data;
    this.id = new FileID({ data: this.data });
    this.versioning = versioning;
    this.compression = compression;
    this.encryption = encryption;
  }
}
