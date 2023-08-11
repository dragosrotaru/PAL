import { Env } from "./core/environment.js";
import { FileSystem } from "./core/filesystem.js";
import { GPTMessageHistory } from "./core/messageHistory.js";
import { TypeSystem } from "./language/typesystem.js";
import { StartRepl } from "./ui/repl.js";

const typeSystem = new TypeSystem();
export const env = new Env(typeSystem);
new FileSystem(env, typeSystem);

// todo this can be virtualized
export const gptHistory = new GPTMessageHistory(env);

StartRepl(env);

/* 
- other "top-level" components with state we need to mangage as one

- repl
- server
- symbol/name registry
- macro registry

*/
