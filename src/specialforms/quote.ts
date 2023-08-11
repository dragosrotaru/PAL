import { type IEnv } from "../interfaces.js";
import { type AST } from "../languages/ast.js";
import { IsList } from "../languages/pal/ast.js";

export type Form = [typeof Identifier, AST];

export const Identifier = Symbol.for("quote");
export const ShortHand = Symbol.for("'");

export const Is = (ast: AST): ast is Form =>
  IsList(ast) &&
  ast.length === 2 &&
  (ast[0] === Identifier || ast[0] === ShortHand);

export const Apply = (env: IEnv) => (ast: Form) => ast[1];
