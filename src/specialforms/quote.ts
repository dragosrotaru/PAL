import type { IEnv } from "../interfaces.js";
import type { Lang } from "../language/ast.js";
import { STATIC } from "../language/typesystem.js";

export type Form = [typeof Identifier, Lang.AST];

export const Identifier = Symbol.for("quote");
export const ShortHand = Symbol.for("'");

export const Is = (ast: Lang.AST): ast is Form =>
  STATIC.IsList(ast) &&
  ast.length === 2 &&
  (ast[0] === Identifier || ast[0] === ShortHand);

export const Apply = (env: IEnv) => (ast: Form) => ast[1];
