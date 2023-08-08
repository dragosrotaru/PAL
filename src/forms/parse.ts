import * as apply from "#src/forms/apply.js";
import { IsString, type AST } from "#src/language/ast.js";
import { type Env } from "#src/language/environment.js";
import { parse } from "#src/language/parser.js";

export type Form = [typeof Identifier, string];

export const Identifier = Symbol.for("parse");

export const Is = (ast: AST): ast is Form =>
  apply.Is(ast) && ast[0] === Identifier && IsString(ast[1]);

export const Apply = (env: Env) => (ast: Form) => parse(ast[1]);
