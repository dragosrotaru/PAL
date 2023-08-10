import { TypeOfIdentifier } from "#src/languages/pal/ast.js";
import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import { Env, NewID, NewObservableForm } from "../core/environment.js";
import { Clue, FileExtension, parser, writer } from "../languages/parser.js";
import { log } from "../logger.js";

export const rootPath = path.join(".");

// TODO subscribe to file deletion/namespace changes and delete subsciber
const subscriptions = new Map<string, () => void>();

export const compile = () => {
  const env = new Env();

  const subToNew = () =>
    env.subscribe(NewID, (ast: NewObservableForm) => {
      const sym = ast[0];
      const filepath = sym.description;
      const content = ast[1];
      if (!filepath)
        throw new Error("subscribed to env/new and filepath is empty");
      // todo refactor the way extensions are handled
      fs.writeFileSync(
        path.join(filepath),
        writer(content, (TypeOfIdentifier(sym).description as Clue) || "txt")
      );
    });

  let unsubFromNew = subToNew();

  const syncFileToEnv = (filepath: string, stats?: fs.Stats) => {
    if (stats?.isFile() || fs.statSync(filepath).isFile()) {
      const file = fs.readFileSync(filepath, "utf-8");
      const ext = path.extname(filepath) as FileExtension;
      const sym = Symbol.for(filepath);

      const ast = parser(file, ext);

      // Before writing to Env, unsubscribe from it to prevent loops
      const unsub = subscriptions.get(filepath);
      if (unsub) unsub();

      if (!env.map.has(sym)) unsubFromNew();

      // write to env
      env.map.set(sym, ast);

      // resubscribe to env
      const unsubscriber = env.subscribe(sym, (ast) => {
        log("compiler", "file-write", filepath, ast);
        fs.writeFileSync(filepath, writer(ast, ext));
      });
      subscriptions.set(filepath, unsubscriber);

      unsubFromNew = subToNew();
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
