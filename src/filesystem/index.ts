import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import { Constructor } from "../language/environment.js";
import { parse, write } from "../language/parser.js";

export const rootPath = path.join("test/source.sx");

// TODO subscribe to file deletion/namespace changes and delete subsciber
let unsubscriber;

export const compile = () => {
  const env = Constructor();

  // Set up the chokidar watcher
  const watcher = chokidar.watch(rootPath, {
    ignoreInitial: false,
    persistent: true,
    followSymlinks: true,
  });

  watcher.on("change", (filepath, stats) => {
    console.log("filereader");
    const file = fs.readFileSync(filepath, "utf-8");
    const ext = path.extname(filepath);
    if (ext === ".sx") {
      env.map.set(Symbol.for(filepath), parse(file));
    }
  });

  watcher.once("change", (filepath: string, stats: fs.Stats) => {
    const ext = path.extname(filepath);
    if (ext === ".sx") {
      unsubscriber = env.subscribe(Symbol.for(filepath), (value) => {
        console.log("filewriter");
        fs.writeFileSync(filepath, write(value));
      });
    }
  });

  return env;
};
