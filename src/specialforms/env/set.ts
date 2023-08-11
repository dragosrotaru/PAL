import { SET_ID } from "../../core/environment.js";
import type { IEnv } from "../../interfaces.js";
import { Lang } from "../../language/ast.js";
import { STATIC } from "../../language/typesystem.js";

//** ( set i x ) */
export type Form = [typeof SET_ID, Lang.ID, Lang.AST];

export const Is = (ast: Lang.AST): ast is Form =>
  STATIC.IsList(ast) &&
  ast.length === 3 &&
  STATIC.IsID(ast[0]) &&
  ast[0] === SET_ID &&
  STATIC.IsID(ast[1]);

export const Apply = (env: IEnv) => (ast: Form) => {
  env.map.set(ast[1], ast[2]);
  return undefined;
};
