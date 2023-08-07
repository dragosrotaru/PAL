import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import { Constructor } from "../language/environment.js";
import { parse, write } from "../language/parser.js";
import { log } from "../logger.js";

export const rootPath = path.join("test");
export const DEFAULT_LANG_EXT = ".pal";

// TODO subscribe to file deletion/namespace changes and delete subsciber
const subscriptions = new Map<string, () => void>();

export const compile = () => {
  const env = Constructor();

  const syncFileToEnv = (filepath: string, stats?: fs.Stats) => {
    if (stats?.isFile() || fs.statSync(filepath).isFile()) {
      const file = fs.readFileSync(filepath, "utf-8");
      const ext = path.extname(filepath);

      if (ext === DEFAULT_LANG_EXT) {
        const ast = parse(file);

        // Before writing to Env, unsubscribe from it to prevent loops
        const unsub = subscriptions.get(filepath);
        if (unsub) unsub();

        // write to env
        env.map.set(Symbol.for(filepath), ast);

        // resubscribe to env
        const unsubscriber = env.subscribe(Symbol.for(filepath), (ast) => {
          log("compiler", "file-write", filepath, ast);
          fs.writeFileSync(filepath, write(ast));
        });
        subscriptions.set(filepath, unsubscriber);
      }
    }
  };

  // Set up the chokidar watcher
  const watcher = chokidar.watch(rootPath, {
    ignoreInitial: false,
    persistent: true,
    followSymlinks: true,
  });

  watcher.on("change", (filepath, stats) => {
    log("compiler", "file-change", filepath, stats);
    syncFileToEnv(filepath, stats);
  });
  watcher.on("add", (filepath, stats) => {
    log("compiler", "file-add", filepath, stats);
    syncFileToEnv(filepath, stats);
  });
  return env;
};
