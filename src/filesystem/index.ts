import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import { Constructor } from "../language/environment.js";
import { parse, write } from "../language/parser.js";
import { log } from "../logger.js";

export const rootPath = path.join("test/source.sx");

// TODO subscribe to file deletion/namespace changes and delete subsciber
let unsubscriber;

export const compile = () => {
  const env = Constructor();

  const processFiles = (filepath: string, stats?: fs.Stats) => {
    if (stats?.isFile) {
      const file = fs.readFileSync(filepath, "utf-8");
      const ext = path.extname(filepath);
      if (ext === ".sx") {
        const ast = parse(file);
        log("compiler", "parsing .sx file", file);
        env.map.set(Symbol.for(filepath), parse(file));
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
    log("compiler", "file-change", filepath);
    processFiles(filepath, stats);
  });
  watcher.on("add", (filepath, stats) => {
    log("compiler", "file-change", filepath);
    processFiles(filepath, stats);
  });

  watcher.once("change", (filepath: string, stats: fs.Stats) => {
    const ext = path.extname(filepath);
    if (ext === ".sx") {
      unsubscriber = env.subscribe(Symbol.for(filepath), (ast) => {
        log("compiler", "file-write", filepath, ast);
        fs.writeFileSync(filepath, write(ast));
      });
    }
  });

  return env;
};
