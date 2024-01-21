import path from "path";
import { isUnknownObject } from "../../object-type-guard";
import { ParsingError } from "../../parsing-error";
import { StorageBackendID } from "../id";

export class LocalStorageBackendConfig {
  public static type = "local-drive" as const;
  public readonly type = LocalStorageBackendConfig.type;

  public readonly id: StorageBackendID;
  public readonly name: string;
  public readonly rootPath: string;

  constructor(name: string, rootPath: string, id: StorageBackendID) {
    this.name = name;
    this.rootPath = rootPath;
    this.id = id;
  }

  get resolvePath() {
    return path.resolve(__dirname, this.rootPath);
  }

  serialize() {
    return JSON.stringify(this);
  }

  static parse(input: unknown): LocalStorageBackendConfig {
    if (!isUnknownObject(input)) {
      throw new ParsingError(
        `${LocalStorageBackendConfig.name} expected object`
      );
    }
    if (input.type !== LocalStorageBackendConfig.type) {
      throw new ParsingError(
        `${LocalStorageBackendConfig.name} expected type property with value ${LocalStorageBackendConfig.type} but received ${input.type} `
      );
    }
    if (typeof input.name !== "string") {
      throw new ParsingError(
        `${LocalStorageBackendConfig.name} expected name property of type string`
      );
    }
    if (typeof input.rootPath !== "string") {
      throw new ParsingError(
        `${LocalStorageBackendConfig.name} expected rootPath property of type string`
      );
    }
    if (typeof input.id !== "string") {
      throw new ParsingError(
        `${LocalStorageBackendConfig.name} expected id property of type string`
      );
    }
    return new LocalStorageBackendConfig(
      input.name,
      input.rootPath,
      new StorageBackendID(input.id)
    );
  }
}

export type StorageBackendConfig = LocalStorageBackendConfig;
