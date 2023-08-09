import { type Env } from "../core/environment.js";
import { evaluate } from "../core/evaluator.js";
import { IsList, type PAL } from "../languages/pal/ast.js";

export type Form = [typeof Identifier, PAL];

export const Identifier = Symbol.for("eval");

export const Is = (ast: PAL): ast is Form =>
  IsList(ast) && ast.length === 2 && ast[0] === Identifier;

export const Apply = (env: Env) => async (ast: Form) =>
  evaluate(env)(await evaluate(env)(ast[1]));
