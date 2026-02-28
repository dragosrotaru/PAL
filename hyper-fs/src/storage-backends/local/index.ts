import { promises as fs } from "fs";
import path from "path";
import type { FileID } from "../../file/id";
import type { File } from "../../file";
import type { StorageBackend } from "..";
import type { StorageBackendID } from "../id";
import type { LocalStorageBackendConfig } from "../config";
import type { DeviceID } from "../../device/id";
import { DeviceManifest } from "../../device/manifest";

export class LocalStorageBackend implements StorageBackend {
  public readonly id: StorageBackendID;
  public readonly name: string;
  private readonly config: LocalStorageBackendConfig;
  constructor(config: LocalStorageBackendConfig) {
    this.config = config;
    this.id = config.id;
    this.name = config.name;
  }
  get rootPath() {
    return this.config.resolvePath;
  }
  private pathFromID(id: FileID): string {
    return path.resolve(this.rootPath, "/files/", id.toString());
  }
  async getDeviceManifest(id: DeviceID) {
    return new DeviceManifest();
  }
  async exists(id: FileID): Promise<boolean> {
    try {
      await fs.stat(this.pathFromID(id));
      return true;
    } catch (error) {
      return false;
    }
  }
  async get(id: FileID): Promise<Buffer> {
    return fs.readFile(this.pathFromID(id));
  }
  async add(file: File): Promise<void> {
    if (await this.exists(file.id)) {
      return;
    } else {
      return fs.writeFile(this.pathFromID(file.id), file.data);
    }
  }
  async delete(id: FileID): Promise<void> {
    return fs.rm(this.pathFromID(id));
  }
}
