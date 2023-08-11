import { type IEnv } from "../interfaces.js";
import { type AST } from "../languages/ast.js";
import { IsString } from "../languages/pal/ast.js";
import { parser } from "../languages/parser.js";
import * as apply from "./apply.js";

export type Form = [typeof Identifier, string];

export const Identifier = Symbol.for("parse");

export const Is = (ast: AST): ast is Form =>
  apply.Is(ast) && ast[0] === Identifier && IsString(ast[1]);

export const Apply = (env: IEnv) => (ast: Form) => parser(ast[1]);
