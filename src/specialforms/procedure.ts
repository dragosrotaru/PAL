import { evaluate } from "../core/evaluator.js";
import type { IEnv } from "../interfaces.js";
import type { Lang } from "../language/ast.js";
import { STATIC } from "../language/typesystem.js";

export type Form = [Lang.Procedure, Lang.AST];

export const Is = (ast: Lang.AST): ast is Form =>
  STATIC.IsList(ast) && ast.length === 2 && STATIC.IsProcedure(ast[0]);

export const Apply = (env: IEnv) => async (ast: Form) => {
  if (STATIC.IsList(ast[1])) {
    return evaluate(env)(await ast[0](env)(...ast[1]));
  }
  return evaluate(env)(await ast[0](env)(ast[1]));
};
