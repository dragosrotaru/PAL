import { evaluate } from "../core/evaluator.js";
import type { IEnv } from "../interfaces.js";
import type { Lang } from "../language/ast.js";
import { STATIC } from "../language/typesystem.js";
import { Is as IsLambda, type Form as LambdaForm } from "./lambda.js";

//** ( rator rand ) */
export type Form = [Lang.Procedure | Lang.ID | LambdaForm, Lang.AST];

export const Is = (ast: Lang.AST): ast is Form =>
  STATIC.IsList(ast) &&
  ast.length === 2 &&
  (STATIC.IsProcedure(ast[0]) || STATIC.IsID(ast[0]) || IsLambda(ast[0]));

export const Apply = (env: IEnv) => async (ast: Form) => {
  const rator = await evaluate(env)(ast[0]);
  const rand = await evaluate(env)(ast[1]);
  return evaluate(env)([rator, rand]);
};
