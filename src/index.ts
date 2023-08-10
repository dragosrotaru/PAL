import { Env } from "./core/environment.js";
import { FileSystem } from "./filesystem/index.js";

const env = new Env();
const filesystem = new FileSystem(env);
