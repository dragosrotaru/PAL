import { type AST } from "#src/language/ast.js";
import { type Env } from "#src/language/environment.js";

export const Identifier = Symbol.for("env");

export type Form = typeof Identifier;

export const Is = (ast: AST): ast is Form => ast === Identifier;

export const Apply = (env: Env) => (ast: Form) => {
  return env.getAll();
};
