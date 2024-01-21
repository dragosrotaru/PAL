import type { Lang } from "../language/ast.js";
import { parser } from "../language/parser/index.js";
import { STATIC } from "../language/typesystem.js";

/* this needs type checking so it needs to be a macro 
(macro (parse x.txt clue) (parse (x clue)))
*/

export type Form = [typeof Identifier, string];

export const Identifier = Symbol.for("parse");

export const Is = (ast: Lang.AST): ast is Form =>
  STATIC.IsList(ast) &&
  ast.length === 2 &&
  ast[0] === Identifier &&
  STATIC.IsString(ast[1]);

export const Apply = (ast: Form) => parser(ast[1]);
