/**
 * `quit` special form — immediately terminates the process with code 0.
 * Identical in behavior to `exit`; could be a stored procedure instead.
 * @author claude
 */
import type { Lang } from "../language/ast.js";

// todo enable a rebuild / restart
// todo @claude: quit and exit are duplicates; unify into one and register the other as an alias

/* this should be a stored procedure, can call with no params or any params, doesnt matter */

export const Identifier = Symbol.for("quit");

export type Form = typeof Identifier;

export const Is = (ast: Lang.AST): ast is Form => ast === Identifier;

export const Apply = () => process.exit(0);
