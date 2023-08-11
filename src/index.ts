import { Env } from "./core/environment.js";
import { FileSystem } from "./filesystem/index.js";
import { GPTMessageHistory } from "./gpt/messageHistory.js";

export const env = new Env();
new FileSystem(env);
export const gptHistory = new GPTMessageHistory(env);
