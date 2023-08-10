import { Env } from "../core/environment.js";
import { evaluate } from "../core/evaluator.js";
import {
  IsIdentifier,
  IsIdentifierList,
  IsList,
  type AsyncProcedure,
  type IdentifierList,
  type PAL,
} from "../languages/pal/ast.js";

export const Identifier = Symbol.for("lambda");

export type Form = [typeof Identifier, IdentifierList, PAL];

export const Is = (ast: PAL): ast is Form =>
  IsList(ast) &&
  ast.length === 3 &&
  IsIdentifier(ast[0]) &&
  ast[0] === Identifier &&
  IsIdentifierList(ast[1]);

export const Apply =
  (env: Env) =>
  (ast: Form): AsyncProcedure => {
    const argsIdentifiers = ast[1];
    const body = ast[2];
    return (prenv: Env) =>
      (...values: PAL[]) => {
        const env = new Env(prenv.map);
        argsIdentifiers.forEach((identifier, i) =>
          env.map.set(identifier, values[i])
        );
        return evaluate(env)(body);
      };
  };
