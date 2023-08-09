import { type Env } from "../core/environment.js";
import { IsList, type PAL } from "../languages/pal/ast.js";

export type Form = [typeof Identifier, PAL];

export const Identifier = Symbol.for("quote");

export const Is = (ast: PAL): ast is Form =>
  IsList(ast) && ast.length === 2 && ast[0] === Identifier;

export const Apply = (env: Env) => (ast: Form) => ast[1];
