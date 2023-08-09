import { type Env } from "../../language-core/environment.js";
import { type PAL } from "../../languages/pal/ast.js";

export const Identifier = Symbol.for("env");

export type Form = typeof Identifier;

export const Is = (ast: PAL): ast is Form => ast === Identifier;

export const Apply = (env: Env) => (ast: Form) => env.getAll();
