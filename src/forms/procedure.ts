import { Env } from "../language-core/environment.js";
import { evaluate } from "../language-core/evaluator.js";
import {
  IsList,
  IsProcedure,
  type PAL,
  type Procedure,
} from "../languages/pal/ast.js";

export type Form = [Procedure, PAL];

export const Is = (ast: PAL): ast is Form =>
  IsList(ast) && ast.length === 2 && IsProcedure(ast[0]);

export const Apply = (env: Env) => async (ast: Form) => {
  if (IsList(ast[1])) {
    return evaluate(env)(await ast[0](env)(...ast[1]));
  }
  return evaluate(env)(await ast[0](env)(ast[1]));
};
