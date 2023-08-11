import type { IEnv } from "../interfaces.js";
import type { Lang } from "../language/ast.js";
import { parser } from "../language/parser/index.js";
import { STATIC } from "../language/typesystem.js";
import * as apply from "./apply.js";

export type Form = [typeof Identifier, string];

export const Identifier = Symbol.for("parse");

export const Is = (ast: Lang.AST): ast is Form =>
  apply.Is(ast) && ast[0] === Identifier && STATIC.IsString(ast[1]);

export const Apply = (env: IEnv) => (ast: Form) => parser(ast[1]);
