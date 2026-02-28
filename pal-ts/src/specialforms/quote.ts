/**
 * `(quote expr)` or `` `expr `` — returns expr unevaluated.
 * Backtick alias is syntactically recognized but requires parser support for proper quoting.
 * @author claude
 */
import type { Lang } from "../language/ast.js";
import { STATIC } from "../language/typesystem.js";

/*
this is a special form, but the Backtick here is completely wrong, it needs to be
aded to the syntax so you can quote identifiers
*/

export type Form = [typeof Identifier, Lang.AST];

/** Symbol identity for `(quote ...)` form. */
export const Identifier = Symbol.for("quote");
/** Alias symbol for backtick quoting — parser support still needed. */
// todo @claude: backtick quoting is not handled by the parser tokenizer; add ` as a quote shorthand in parser/pal.ts
export const BackTick = Symbol.for("`");

export const Is = (ast: Lang.AST): ast is Form =>
  STATIC.IsList(ast) && ast.length === 2 && (ast[0] === Identifier || ast[0] === BackTick);

export const Apply = (ast: Form) => ast[1];
