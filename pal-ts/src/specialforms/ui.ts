/**
 * `(ui)` or `(ui id/expr)` special form — opens the browser GUI for a given env entry.
 * If the argument is not already an ID, stores the value in a random env key under `ui/`.
 * Starts the Express+WebSocket server lazily on first use.
 * @author claude
 */
import path from "path";
import type { IContext } from "../interfaces.js";
import type { Lang } from "../language/ast.js";
import { STATIC } from "../language/typesystem.js";
import { openGUI } from "../ui/web/server.js";

/* stored procedure, then just add a macro to call functions without parameters? */

export type Form = [typeof Identifier, Lang.AST] | typeof Identifier;

export const Identifier = Symbol.for("ui");

export const Is = (ast: Lang.AST): ast is Form =>
  (STATIC.IsList(ast) && ast.length === 2 && ast[0] === Identifier) || ast === Identifier;

export const Apply = (ctx: IContext) => (ast: Form) => {
  if (ast === Identifier) {
    openGUI(Symbol(), ctx);
    return undefined;
  }
  let id: Lang.ID;
  if (!STATIC.IsID(ast[1])) {
    id = Symbol.for(path.join("ui", crypto.randomUUID()));
    ctx.env.map.set(id, ast[1]);
  } else {
    id = ast[1];
  }
  openGUI(id, ctx);
  return undefined;
};
