import { Env } from "./core/environment.js";
import { evaluate } from "./core/evaluator.js";
import { FileSystem } from "./core/filesystem.js";
import { GPTMessageHistory } from "./core/messageHistory.js";
import { IContext } from "./interfaces.js";
import { TypeSystem } from "./language/typesystem.js";
import { StartRepl } from "./ui/repl.js";

const ts = new TypeSystem();
const env = new Env(ts);
const fs = new FileSystem(env, ts);

// todo this can be virtualized once we can express json
export const gpt = new GPTMessageHistory(env);

const ctx: IContext = {
  ts,
  env,
  fs,
  gpt,
  eval: evaluate,
  macros: [],
};

StartRepl(ctx);

/* 
- other "top-level" components with state we need to mangage as one

- repl
- server
- symbol/name registry
- macro registry

*/
