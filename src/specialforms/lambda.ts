import { evaluate } from "../core/evaluator.js";
import { type IEnv } from "../interfaces.js";
import { type AST } from "../languages/ast.js";
import {
  IsIdentifier,
  IsIdentifierList,
  IsList,
  type AsyncProcedure,
  type IdentifierList,
} from "../languages/pal/ast.js";

export const Identifier = Symbol.for("lambda");

export type Form = [typeof Identifier, IdentifierList, AST];

export const Is = (ast: AST): ast is Form =>
  IsList(ast) &&
  ast.length === 3 &&
  IsIdentifier(ast[0]) &&
  ast[0] === Identifier &&
  IsIdentifierList(ast[1]);

export const Apply =
  (env: IEnv) =>
  (ast: Form): AsyncProcedure => {
    const argsIdentifiers = ast[1];
    const body = ast[2];
    return (prenv: IEnv) =>
      (...values: AST[]) => {
        const env = prenv.extend();
        argsIdentifiers.forEach((identifier, i) =>
          env.map.set(identifier, values[i])
        );
        return evaluate(env)(body);
      };
  };
