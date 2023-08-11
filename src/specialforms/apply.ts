import { evaluate } from "../core/evaluator.js";
import { type IEnv } from "../interfaces.js";
import { type AST } from "../languages/ast.js";
import {
  IsIdentifier,
  IsList,
  IsProcedure,
  type Identifier,
  type Procedure,
} from "../languages/pal/ast.js";
import { Is as IsLambda, type Form as LambdaForm } from "./lambda.js";

//** ( rator rand ) */
export type Form = [Procedure | Identifier | LambdaForm, AST];

export const Is = (ast: AST): ast is Form =>
  IsList(ast) &&
  ast.length === 2 &&
  (IsProcedure(ast[0]) || IsIdentifier(ast[0]) || IsLambda(ast[0]));

export const Apply = (env: IEnv) => async (ast: Form) => {
  const rator = await evaluate(env)(ast[0]);
  const rand = await evaluate(env)(ast[1]);
  return evaluate(env)([rator, rand]);
};
