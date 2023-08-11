import type { IEnv } from "../interfaces.js";
import type { Lang } from "../language/ast.js";

export const Identifier = Symbol.for("exit");

export type Form = typeof Identifier;

export const Is = (ast: Lang.AST): ast is Form => ast === Identifier;

export const Apply = (env: IEnv) => (ast: Form) => process.exit(0);
