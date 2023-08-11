import type { IEnv } from "../interfaces.js";
import type { Lang } from "../language/ast.js";

// todo enable a rebuild / restart

export const Identifier = Symbol.for("quit");

export type Form = typeof Identifier;

export const Is = (ast: Lang.AST): ast is Form => ast === Identifier;

export const Apply = (env: IEnv) => (ast: Form) => process.exit(0);
