import { type IEnv } from "../../interfaces.js";
import { type AST } from "../../languages/ast.js";
import {
  IsIdentifier,
  IsList,
  type Identifier as IDType,
} from "../../languages/pal/ast.js";

//** ( set i x ) */
export const Identifier = Symbol.for("env/set");

export type Form = [typeof Identifier, IDType, AST];

export const Is = (ast: AST): ast is Form =>
  IsList(ast) &&
  ast.length === 3 &&
  IsIdentifier(ast[0]) &&
  ast[0] === Identifier &&
  IsIdentifier(ast[1]);

export const Apply = (env: IEnv) => (ast: Form) => {
  env.map.set(ast[1], ast[2]);
  return undefined;
};
