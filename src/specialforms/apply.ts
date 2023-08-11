import { evaluate } from "../core/evaluator.js";
import type { IEnv } from "../interfaces.js";
import type { Lang } from "../language/ast.js";
import { STATIC } from "../language/typesystem.js";

//** ( rator rand ) */
export type Form = [Lang.Procedure, Lang.AST];

export const Is = (ast: Lang.AST): ast is Form =>
  STATIC.IsList(ast) && ast.length === 2 && STATIC.IsProcedure(ast[0]);

export const Apply = (env: IEnv) => async (ast: Form) => {
  const rator = ast[0];
  const rand = ast[1];
  console.log("rator", rator);
  console.log("rand", rand);
  if (STATIC.IsList(rand)) {
    console.log("is list");
    return evaluate(env)(await rator(...rand));
  }
  return evaluate(env)(await rator(rand));
};
