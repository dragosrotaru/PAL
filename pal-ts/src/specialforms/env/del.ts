/**
 * `(env/delete id)` special form — removes a key from the environment map.
 * Triggers env/del observers and notifies per-key subscribers with undefined.
 * @author claude
 */
import { DELETE_ID } from "../../core/environment.js";
import type { IEnv } from "../../interfaces.js";
import type { Lang } from "../../language/ast.js";
import { STATIC } from "../../language/typesystem.js";

export type Form = [typeof DELETE_ID, Lang.ID];

export const Is = (ast: Lang.AST): ast is Form =>
  STATIC.IsIDList(ast) && ast.length === 2 && ast[0] === DELETE_ID;

export const Apply = (env: IEnv) => (ast: Form) => {
  return env.map.delete(ast[1]);
};
