/**
 * `(env/set id value)` special form — sets a key in the environment to the given AST value.
 * Triggers env/set observers and, if the key is new, env/new observers.
 * @author claude
 */
import { SET_ID } from "../../core/environment.js";
import type { IEnv } from "../../interfaces.js";
import type { Lang } from "../../language/ast.js";
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
