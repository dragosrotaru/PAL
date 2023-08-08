import { IsList, type AST } from "#src/language/ast.js";
import { type Env } from "#src/language/environment.js";
import { evaluate } from "#src/language/evaluator.js";

export type Form = [typeof Identifier, AST];

export const Identifier = Symbol.for("eval");

export const Is = (ast: AST): ast is Form =>
  IsList(ast) && ast.length === 2 && ast[0] === Identifier;

export const Apply = (env: Env) => async (ast: Form) =>
  evaluate(env)(await evaluate(env)(ast[1]));
