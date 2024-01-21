import { Owner } from "../owner";
import { LocalStorageBackend } from "../storage-backends/local";
import type { DeviceConfig } from "./config";
import type { StorageBackend } from "../storage-backends";
import type { StorageBackendID } from "../storage-backends/id";
import type { Password } from "../password";
import type { FileID } from "../file/id";
import type { FilePath } from "../file/path";
import { File } from "../file";
import type { DeviceID } from "./id";
import { FileSystem } from "../file/system";

export class Device {
  private readonly owner: Owner;
  private readonly config: DeviceConfig;
  private readonly storageDevices: Map<string, StorageBackend> = new Map();
  private readonly fileSystem: FileSystem = new FileSystem();
  constructor(password: Password, config: DeviceConfig) {
    this.owner = new Owner(password, config);
    this.config = config;
    this.config.storageDevices.forEach((config) => {
      switch (config.type) {
        case "local-drive":
          const storageDevice = new LocalStorageBackend(config);
          this.storageDevices.set(storageDevice.id.value, storageDevice);
      }
    });
  }
  get id() {
    return this.config.deviceID;
  }
  async initialize() {
    const nodeManifests = await Promise.all(
      this.storageDeviceArray.map(
        async (dev) => await dev.getDeviceManifest(this.id)
      )
    );
  }
  private get storageDeviceArray(): StorageBackend[] {
    return Array.from(this.storageDevices.values());
  }
  fileExists(path: FilePath): boolean {
    return this.fileSystem.exists(path);
  }
  getFileFromFilePath(path: FilePath): File {
    const file = this.fileSystem.get(path);
    if (file) {
      return file;
    } else {
      throw new Error("not found");
    }
  }
  createNewFile(path: FilePath) {
    if (this.fileExists(path)) {
      throw new Error("file already exists");
    } else {
      const file = new File(Buffer.from([]));
      this.fileSystem.set(path, file);
    }
  }
}
