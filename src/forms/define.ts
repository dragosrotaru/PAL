import {
  IsIdentifier,
  IsList,
  type AST,
  type Identifier as IDType,
} from "#src/language/ast.js";
import { type Env } from "#src/language/environment.js";

//** ( define i x ) */
export const Identifier = Symbol.for("define");

export type Form = [typeof Identifier, IDType, AST];

export const Is = (ast: AST): ast is Form =>
  IsList(ast) &&
  ast.length === 3 &&
  IsIdentifier(ast[0]) &&
  ast[0] === Identifier &&
  IsIdentifier(ast[1]);

export const Apply = (env: Env) => (ast: Form) => {
  env.map.set(ast[1], ast[2]);
  return undefined;
};