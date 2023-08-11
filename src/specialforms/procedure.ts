import { evaluate } from "../core/evaluator.js";
import { type IEnv } from "../interfaces.js";
import { type AST } from "../languages/ast.js";
import { IsList, IsProcedure, type Procedure } from "../languages/pal/ast.js";

export type Form = [Procedure, AST];

export const Is = (ast: AST): ast is Form =>
  IsList(ast) && ast.length === 2 && IsProcedure(ast[0]);

export const Apply = (env: IEnv) => async (ast: Form) => {
  if (IsList(ast[1])) {
    return evaluate(env)(await ast[0](env)(...ast[1]));
  }
  return evaluate(env)(await ast[0](env)(ast[1]));
};
