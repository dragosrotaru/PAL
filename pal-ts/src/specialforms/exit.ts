/**
 * `exit` special form — immediately terminates the process with code 0.
 * Identical in behavior to `quit`; could be a stored procedure instead.
 * @author claude
 */
import type { Lang } from "../language/ast.js";

/*  like quit, this can be a special form / procedure */

export const Identifier = Symbol.for("exit");

export type Form = typeof Identifier;

export const Is = (ast: Lang.AST): ast is Form => ast === Identifier;

export const Apply = () => process.exit(0);
