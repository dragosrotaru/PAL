import { evaluate } from "../core/evaluator.js";
import { type IEnv } from "../interfaces.js";
import { type AST } from "../languages/ast.js";
import { IsList } from "../languages/pal/ast.js";

export type Form = [typeof Identifier, AST];

export const Identifier = Symbol.for("eval");

export const Is = (ast: AST): ast is Form =>
  IsList(ast) && ast.length === 2 && ast[0] === Identifier;

export const Apply = (env: IEnv) => async (ast: Form) =>
  evaluate(env)(await evaluate(env)(ast[1]));
