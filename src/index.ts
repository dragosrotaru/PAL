import { Env } from "./core/environment.js";
import { FileSystem } from "./filesystem/index.js";

export const env = new Env();
new FileSystem(env);
