import { Is as IsLambda, type Form as LambdaForm } from "#src/forms/lambda.js";
import {
  IsIdentifier,
  IsList,
  IsProcedure,
  type AST,
  type Identifier,
  type Procedure,
} from "#src/language/ast.js";
import { type Env } from "#src/language/environment.js";
import { evaluate } from "#src/language/evaluator.js";

//** ( rator rand ) */
export type Form = [Procedure | Identifier | LambdaForm, AST];

export const Is = (ast: AST): ast is Form =>
  IsList(ast) &&
  ast.length === 2 &&
  (IsProcedure(ast[0]) || IsIdentifier(ast[0]) || IsLambda(ast[0]));

export const Apply = (env: Env) => async (ast: Form) => {
  const rator = await evaluate(env)(ast[0]);
  const rand = await evaluate(env)(ast[1]);
  return evaluate(env)([rator, rand]);
};
