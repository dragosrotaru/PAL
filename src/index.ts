import { Env } from "./core/environment.js";
import { FileSystem } from "./core/filesystem.js";
import { GPTMessageHistory } from "./core/messageHistory.js";
import { StartRepl } from "./userinterfaces/repl.js";

export const env = new Env();
new FileSystem(env);

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
