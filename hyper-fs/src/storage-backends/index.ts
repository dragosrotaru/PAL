import type { File } from "../file";
import type { FileID } from "../file/id";
import type { DeviceID } from "../device/id";
import type { DeviceManifest } from "../device/manifest";
import type { StorageBackendID } from "./id";

export interface StorageBackend {
  id: StorageBackendID;
  name: string;
  getDeviceManifest(id: DeviceID): Promise<DeviceManifest>;
  exists(id: FileID): Promise<boolean>;
  get(id: FileID): Promise<Buffer>;
  add(file: File): Promise<void>;
  delete(id: FileID): Promise<void>;
}
