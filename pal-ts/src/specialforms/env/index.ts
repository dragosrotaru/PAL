/**
 * `env` special form — evaluating the bare `env` symbol returns all environment entries
 * as a list of [ID, AST] pairs via env.getAll().
 * @author claude
 */
import { GETALL_ID } from "../../core/environment.js";
import type { IEnv } from "../../interfaces.js";
import type { Lang } from "../../language/ast.js";

export type Form = typeof GETALL_ID;

export const Is = (ast: Lang.AST): ast is Form => ast === GETALL_ID;

export const Apply = (env: IEnv) => env.getAll();
