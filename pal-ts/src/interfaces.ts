/**
 * Core type contracts for the Pal runtime: IContext, IEnv, IEvaluate, Macro, and observer utilities.
 * Every subsystem (evaluator, special forms, UI) depends on these interfaces.
 * @author claude
 */
import type { FileSystem } from "./core/filesystem.js";
import type { GPTMessageHistory } from "./core/messageHistory.js";
import type { Lang } from "./language/ast.js";
import type { TypeSystem } from "./language/typesystem.js";

/** Callback invoked when a subscribed environment key changes. */
export type IObserver<V> = (v: V) => undefined;
/** Cancels an active subscription when called. */
export type IUnsubscribe = () => undefined;

/**
 * Reactive key-value store mapping Lang.ID symbols to AST values.
 * Supports pub/sub so consumers can react to value changes.
 * @author claude
 */
export interface IEnv {
  ts: TypeSystem;
  map: Map<Lang.ID, Lang.AST>;

  set: (id: Lang.ID, value: Lang.AST) => true;
  get: (id: Lang.ID) => Lang.AST;
  has: (id: Lang.ID) => boolean;

  getAll: () => [Lang.ID, Lang.AST][];
  subscribe: <V extends Lang.AST>(id: Lang.ID, observer: IObserver<V>) => IUnsubscribe;
  unsubscribe: (id: Lang.ID, observer: IObserver<Lang.AST>) => undefined;
  extend: () => IEnv;
}

/** Curried async evaluator: takes a context, returns a function from AST to AST. */
export type IEvaluate = (ctx: IContext) => (ast: Lang.AST) => Promise<Lang.AST>;

/**
 * The runtime context threaded through all evaluation: env, eval, type system, FS, GPT history, macros.
 * Passed by reference — modifications to env/macros are visible across all concurrent evaluations.
 * @author claude
 */
export interface IContext {
  env: IEnv;
  eval: IEvaluate;
  ts: TypeSystem;
  fs: FileSystem;
  gpt: GPTMessageHistory;
  macros: Macro[];
}

/** A hygenic macro rule: pattern is matched against AST, then substituted with template. */
export type Macro = {
  pattern: Lang.AST;
  template: Lang.AST;
};
