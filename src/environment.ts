import fs from "fs";
import path from "path";
import { AST, Identifier } from "./ast";

export const rootPath = path.join("data");

export class Env {
  private _env: Map<string, AST> = new Map();
  constructor(env?: Env) {
    if (env) this._env = new Map(env._env);
  }
  public get(id: Identifier) {
    if (!id.description) return null;
    return this._env.get(id.description);
  }
  public set(id: Identifier, value: AST) {
    if (!id.description) return false;
    this._env.set(id.description, value);
    return true;
  }

  public getAll() {
    const list: [symbol, AST][] = [];
    this._env.forEach((value, key) => {
      console.log(key);
      list.push([Symbol(key), value]);
    });
    return list;
  }

  public getKeys() {
    const list: symbol[] = [];
    this._env.forEach((value, key) => {
      list.push(Symbol(key));
    });
    return list;
  }
}

const list = (file: string, filename: string, env: Env) => {
  const rows = file.split("\n").map(Symbol);
  env.set(Symbol(filename), rows);
  rows.forEach((row) => env.set(row, null));
};

export const compile = () => {
  const env = new Env();
  const filepath = "/countries.list";
  const filename = filepath.split(".").slice(0, -1).join(".");
  const ext = filepath.split(".").pop();
  const file = fs.readFileSync(path.join(rootPath, filepath), "utf-8");

  if (ext === "list") {
    list(file, filename, env);
  }

  return env;
};
