import { GETALL_ID } from "../../core/environment.js";
import type { IEnv } from "../../interfaces.js";
import type { Lang } from "../../language/ast.js";

export type Form = typeof GETALL_ID;

export const Is = (ast: Lang.AST): ast is Form => ast === GETALL_ID;

export const Apply = (env: IEnv) => (ast: Form) => env.getAll();
