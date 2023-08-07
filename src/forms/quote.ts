import * as apply from "#src/forms/apply.js";
import { type AST } from "#src/language/ast.js";
import { type Env } from "#src/language/environment.js";

export type Form = [typeof Identifier, AST];

export const Identifier = Symbol.for("quote");

export const Is = (ast: AST): ast is Form =>
  apply.Is(ast) && ast[0] === Identifier;

export const Apply = (env: Env) => async (ast: Form) => {
  return ast[1];
};
