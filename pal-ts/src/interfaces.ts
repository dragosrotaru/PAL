import type { FileSystem } from "./core/filesystem.js";
import type { GPTMessageHistory } from "./core/messageHistory.js";
import type { Lang } from "./language/ast.js";
import type { TypeSystem } from "./language/typesystem.js";

export type IObserver<V> = (v: V) => undefined;
export type IUnsubscribe = () => undefined;

export interface IEnv {
  ts: TypeSystem;
  map: Map<Lang.ID, Lang.AST>;

  set: (id: Lang.ID, value: Lang.AST) => true;
  get: (id: Lang.ID) => Lang.AST;
  has: (id: Lang.ID) => boolean;

  getAll: () => [Lang.ID, Lang.AST][];
  subscribe: <V extends Lang.AST>(
    id: Lang.ID,
    observer: IObserver<V>
  ) => IUnsubscribe;
  unsubscribe: (id: Lang.ID, observer: IObserver<Lang.AST>) => undefined;
  extend: () => IEnv;
}

export type IEvaluate = (ctx: IContext) => (ast: Lang.AST) => Promise<Lang.AST>;
export interface IContext {
  env: IEnv;
  eval: IEvaluate;
  ts: TypeSystem;
  fs: FileSystem;
  gpt: GPTMessageHistory;
  macros: Macro[];
}

export type Macro = {
  pattern: Lang.AST;
  template: Lang.AST;
};
