import { logger as nodeLogger } from "./node.js";
import { logger as webLogger } from "./web.js";

// Simple way to detect the environment (Node.js or browser).
const isNode =
  typeof process !== "undefined" && process.versions && process.versions.node;

export const log = isNode ? nodeLogger : webLogger;
