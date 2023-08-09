import { type Env } from "../core/environment.js";
import { type PAL } from "../languages/pal/ast.js";

export const Identifier = Symbol.for("exit");

export type Form = typeof Identifier;

export const Is = (ast: PAL): ast is Form => ast === Identifier;

export const Apply = (env: Env) => (ast: Form) => process.exit(0);
