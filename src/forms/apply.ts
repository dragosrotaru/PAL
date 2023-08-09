import { type Env } from "../language-core/environment.js";
import { evaluate } from "../language-core/evaluator.js";
import {
  IsIdentifier,
  IsList,
  IsProcedure,
  type Identifier,
  type PAL,
  type Procedure,
} from "../languages/pal/ast.js";
import { Is as IsLambda, type Form as LambdaForm } from "./lambda.js";

//** ( rator rand ) */
export type Form = [Procedure | Identifier | LambdaForm, PAL];

export const Is = (ast: PAL): ast is Form =>
  IsList(ast) &&
  ast.length === 2 &&
  (IsProcedure(ast[0]) || IsIdentifier(ast[0]) || IsLambda(ast[0]));

export const Apply = (env: Env) => async (ast: Form) => {
  const rator = await evaluate(env)(ast[0]);
  const rand = await evaluate(env)(ast[1]);
  return evaluate(env)([rator, rand]);
};
