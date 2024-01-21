import type { Lang } from "../language/ast.js";

/*  like quit this can be a special form / procedure */

export const Identifier = Symbol.for("exit");

export type Form = typeof Identifier;

export const Is = (ast: Lang.AST): ast is Form => ast === Identifier;

export const Apply = () => process.exit(0);
