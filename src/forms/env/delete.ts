import {
  IsIdentifierList,
  type AST,
  type Identifier as IDType,
} from "#src/language/ast.js";
import { type Env } from "#src/language/environment.js";

export const Identifier = Symbol.for("env/delete");

export type Form = [typeof Identifier, IDType];

export const Is = (ast: AST): ast is Form =>
  IsIdentifierList(ast) && ast.length === 2 && ast[0] === Identifier;

export const Apply = (env: Env) => (ast: Form) => {
  return env.map.delete(ast[1]);
};
