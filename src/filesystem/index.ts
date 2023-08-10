import {
  type IEnv,
  type ILanguage,
  type ILogger,
  type IUnsubscribe,
} from "../interfaces/namespace.js";

import chokidar from "chokidar";
import fs from "fs";
import path from "path";

import { NewID, NewObservableForm } from "../core/environment.js";

import {
  TypeOfIdentifier,
  type Identifier,
  type PAL,
} from "../languages/pal/ast.js";

import { type Clue, type FileExtension } from "../languages/index.js";

export const NAME = Symbol.for("filesystem");

const ADD = "add";
const CHANGE = "change";
const WRITE = "write";
const NEW = "new";
const DEFAULT_ENCODING = "utf-8";

/* 

TODO

- Extract Symbol.for and similar conversions

- support other filesystem semantics (for instance rename or move)
- support other encodings than utf8, streaming
- support FUSE based filesystem

*/

export class FileSystem {
  static ROOT = path.join(".");
  private filePathSubscriptions = new Map<string, () => void>();
  private unsubscribeToEnvNew: IUnsubscribe;

  constructor(
    private env: IEnv<Identifier, PAL>,
    private lang: ILanguage<PAL>,
    private logger: ILogger
  ) {
    this.watchFileSystem();
    this.unsubscribeToEnvNew = this.subscribeToEnv();
  }

  /**
   * Returns true if the filePath points to a file
   * @param filePath
   * @returns
   */
  isFile(filePath: string): boolean {
    return fs.statSync(filePath).isFile();
  }

  /**
   * Synchronously reads the contents of a file
   * @param filePath
   * @returns
   */
  readFile(filePath: string): string {
    return fs.readFileSync(filePath, DEFAULT_ENCODING);
  }

  /**
   * Returns extension including the period (".pdf", not "pdf")
   * @param filePath
   * @returns
   */
  getFileExt(filePath: string): FileExtension {
    return path.extname(filePath) as FileExtension;
  }

  /**
   * this function called by filesystem watcher, it is responsible for keeping
   * the environment and the filesystem in sync
   * @param filePath
   * @param stats
   */
  synchronize(filePath: string, stats?: fs.Stats) {
    if (stats?.isFile() || this.isFile(filePath)) {
      const file = this.readFile(filePath);
      const ext = this.getFileExt(filePath);
      const sym = Symbol.for(filePath);

      const ast = this.lang.parse(file, ext);

      // Before writing to the environment, unsubscribe to prevent loops
      const unsub = this.filePathSubscriptions.get(filePath);
      if (unsub) unsub();

      if (!this.env.map.has(sym)) this.unsubscribeToEnvNew();

      // write to env
      this.env.map.set(sym, ast);

      // resubscribe to env
      const unsubscriber = this.env.subscribe(sym, (ast) => {
        this.logger(NAME, WRITE, filePath, ast);
        fs.writeFileSync(filePath, this.lang.write(ast, ext));
      });
      this.filePathSubscriptions.set(filePath, unsubscriber);

      this.subscribeToEnv();
    }
  }

  /**
   * Watch the filesystem for changes
   */
  watchFileSystem() {
    // Set up the chokidar watcher
    const watcher = chokidar.watch(FileSystem.ROOT, {
      ignoreInitial: false,
      persistent: true,
      followSymlinks: true,
    });

    watcher.on(CHANGE, (filepath, stats) => {
      this.logger(NAME, CHANGE, filepath, stats);
      this.synchronize(filepath, stats);
    });

    watcher.on(ADD, (filepath, stats) => {
      this.logger(NAME, ADD, filepath, stats);
      this.synchronize(filepath, stats);
    });
  }

  /**
   * Watch the environment for changes
   * Returns an unsubscriber and sets this.unsubscribeToEnvNew
   */
  subscribeToEnv() {
    this.unsubscribeToEnvNew = this.env.subscribe(
      NewID,
      (ast: NewObservableForm) => {
        const sym = ast[0];
        const filepath = sym.description;
        const content = ast[1];
        if (!filepath)
          throw new Error("subscribed to env/new and filepath is empty");
        // todo refactor the way extensions are handled
        fs.writeFileSync(
          path.join(filepath),
          this.lang.write(
            content,
            (TypeOfIdentifier(sym).description as Clue) || "txt"
          )
        );
      }
    );
    return this.unsubscribeToEnvNew;
  }
}
