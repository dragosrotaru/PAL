import {
  IsList,
  IsProcedure,
  type AST,
  type Procedure,
} from "#src/language/ast.js";
import { Env } from "#src/language/environment.js";
import { evaluate } from "#src/language/evaluator.js";

export type Form = [Procedure, AST];

export const Is = (ast: AST): ast is Form =>
  IsList(ast) && ast.length === 2 && IsProcedure(ast[0]);

export const Apply = (env: Env) => async (ast: Form) => {
  if (IsList(ast[1])) {
    return evaluate(env)(await ast[0](env)(...ast[1]));
  }
  return evaluate(env)(await ast[0](env)(ast[1]));
};
