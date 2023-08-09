import { type Env } from "../../core/environment.js";
import {
  IsIdentifier,
  IsList,
  type Identifier as IDType,
  type PAL,
} from "../../languages/pal/ast.js";

//** ( set i x ) */
export const Identifier = Symbol.for("env/set");

export type Form = [typeof Identifier, IDType, PAL];

export const Is = (ast: PAL): ast is Form =>
  IsList(ast) &&
  ast.length === 3 &&
  IsIdentifier(ast[0]) &&
  ast[0] === Identifier &&
  IsIdentifier(ast[1]);

export const Apply = (env: Env) => (ast: Form) => {
  env.map.set(ast[1], ast[2]);
  return undefined;
};
