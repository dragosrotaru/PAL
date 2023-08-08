import { IsList, type AST } from "#src/language/ast.js";
import { type Env } from "#src/language/environment.js";

export type Form = [typeof Identifier, AST];

export const Identifier = Symbol.for("quote");

export const Is = (ast: AST): ast is Form =>
  IsList(ast) && ast.length === 2 && ast[0] === Identifier;

export const Apply = (env: Env) => (ast: Form) => ast[1];
