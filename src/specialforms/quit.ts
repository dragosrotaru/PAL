import type { IEnv } from "../interfaces.js";
import type { Lang } from "../language/ast.js";

// todo enable a rebuild / restart

/* this should be a stored procedure, can call with no params or any params, doesnt matter */

export const Identifier = Symbol.for("quit");

export type Form = typeof Identifier;

export const Is = (ast: Lang.AST): ast is Form => ast === Identifier;

export const Apply = (env: IEnv) => (ast: Form) => process.exit(0);
