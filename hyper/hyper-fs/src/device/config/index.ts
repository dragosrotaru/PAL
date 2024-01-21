import { StorageBackendID } from "../../storage-backends/id";
import { LocalStorageBackendConfig, StorageBackendConfig } from "../../storage-backends/config";
import { DeviceID } from "../id";
import { ParsingError } from "../../parsing-error";

export class DeviceConfig {
    public readonly deviceID: DeviceID;
    public readonly salt: string;
    public readonly storageDevices: StorageBackendConfig[];
    public readonly defaultStorageDevices: StorageBackendID[];
    constructor(
        deviceID: DeviceID,
      salt: string,
      storageDevices: StorageBackendConfig[],
      defaultStorageDevices: StorageBackendID[] = []
    ) {
      this.deviceID = deviceID;
      this.salt = salt;
      this.storageDevices = storageDevices;
      this.defaultStorageDevices = defaultStorageDevices;
    }
    serialize() {
      return JSON.stringify(this);
    }
    static parse(input: string): DeviceConfig {
      const { nodeID, salt, storageDevices, defaultStorageDevices } =
        JSON.parse(input);
      if (typeof nodeID !== "string") {
        throw new ParsingError(`${DeviceConfig.name} expected nodeID`);
      }
      if (typeof salt !== "string") {
        throw new ParsingError(`${DeviceConfig.name} expected salt`);
      }
      if (!Array.isArray(storageDevices)) {
        throw new ParsingError(`${DeviceConfig.name} expected array of storageDevices`);
      }
      const storageDeviceConfigs = storageDevices.map((config) => {
        switch (config.type) {
          case "local-drive":
            return LocalStorageBackendConfig.parse(config);
          default:
            throw new Error("Config parse - unexpected StorageDevice type");
        }
      });
      if (!Array.isArray(defaultStorageDevices)) {
        throw new ParsingError(`${DeviceConfig.name} expected array of storageDevices`);
      }
      return new DeviceConfig(
        new DeviceID(nodeID),
        salt,
        storageDeviceConfigs,
        defaultStorageDevices.map(StorageBackendID.parse)
      );
    }
  }