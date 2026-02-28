/**
 * @file hyper-fs entry point — FUSE filesystem mount.
 *
 * Mounts an encrypted filesystem at `./mount` using `fuse-native`. The filesystem
 * is backed by a password-encrypted `Device` with a JSON config file.
 *
 * CLI usage:
 * ```
 * node dist/index.js <password> <config-file-path>
 * # or via env: PASSWORD=... CONFIG_FILE_PATH=... node dist/index.js
 * ```
 *
 * Unmounts cleanly on SIGINT (Ctrl+C).
 *
 * This is the hyper-specific FUSE implementation (TypeScript / fuse-native),
 * distinct from the Rust-based `pal-fs` crate which uses `fuser`.
 */
import path from "path";
import { promises as fs } from "fs";
// @ts-ignore
import Fuse from "fuse-native";
import { Password } from "./password";
import { FuseHandlers } from "./fuse";
import { Device } from "./device";
import { DeviceConfig } from "./device/config";

const mount_point = "./mount";

(async function initialize() {
  const args = process.argv.slice(2);

  // Password
  const passwordInput = args[0] || process.env.PASSWORD;
  if (typeof passwordInput !== "string") {
    throw new Error("password is required");
  }
  const password = new Password(passwordInput);

  // Device Config
  const configFilePathInput = args[1] || process.env.CONFIG_FILE_PATH;
  if (typeof configFilePathInput !== "string") {
    throw new Error("config file path is required");
  }
  const configFilePath = path.resolve(__dirname, configFilePathInput);
  const config = DeviceConfig.parse((await fs.readFile(configFilePath)).toString("utf-8"));

  const device = new Device(password, config);

  const fuse = new Fuse(
    mount_point,
    new FuseHandlers(device),
    // all (FUSE-specific options)[http://man7.org/linux/man-pages/man8/mount.fuse.8.html] will be passed to the underlying FUSE module (though we use camel casing instead of snake casing).
    {
      debug: false,
      force: false,
      mkdir: false,
    },
  );

  fuse.mount((err: any) => {
    console.log("MOUNT: ", err);
    if (err) throw err;
  });

  process.once("SIGINT", () => {
    fuse.unmount((err: any) => {
      console.log("UNMOUNT: ", err);
    });
  });
})();
