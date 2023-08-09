import { type Env } from "../language-core/environment.js";
import { IsString, type PAL } from "../languages/pal/ast.js";
import { parser } from "../languages/parser.js";
import * as apply from "./apply.js";

export type Form = [typeof Identifier, string];

export const Identifier = Symbol.for("parse");

export const Is = (ast: PAL): ast is Form =>
  apply.Is(ast) && ast[0] === Identifier && IsString(ast[1]);

export const Apply = (env: Env) => (ast: Form) => parser(ast[1]);
