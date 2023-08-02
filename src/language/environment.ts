import { action, computed, observable } from "mobx";
import { type AST, type Identifier } from "./ast.js";

export class Env {
  @observable private _env: Map<string, AST>;

  constructor(env?: Env) {
    this._env = new Map();
    if (env) {
      env._env.forEach((value, key) => {
        this._env.set(key, value);
      });
    }
  }

  @action
  public get(id: Identifier) {
    if (!id.description) return undefined;
    return this._env.get(id.description);
  }

  @action
  public set(id: Identifier, value: AST) {
    if (!id.description) return false;
    this._env.set(id.description, value);
    return true;
  }

  @computed
  public getAll() {
    const list: [symbol, AST][] = [];
    this._env.forEach((value, key) => {
      list.push([Symbol(key), value]);
    });
    return list;
  }

  @computed
  public getKeys() {
    const list: symbol[] = [];
    this._env.forEach((value, key) => {
      list.push(Symbol(key));
    });
    return list;
  }
}
