import type { IContext } from "../interfaces.js";
import type { Lang } from "../language/ast.js";
import { STATIC } from "../language/typesystem.js";

//** ( rator rand ) */
export type Form = [Lang.Procedure, Lang.AST];

export const Is = (ast: Lang.AST): ast is Form =>
  STATIC.IsList(ast) && ast.length === 2 && STATIC.IsProcedure(ast[0]);

export const Apply = (ctx: IContext) => async (ast: Form) => {
  const rator = ast[0];
  const rand = ast[1];
  if (STATIC.IsList(rand)) {
    return ctx.eval(ctx)(await rator(...rand));
  }
  return ctx.eval(ctx)(await rator(rand));
};
