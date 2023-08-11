import type { IContext } from "../interfaces.js";
import type { Lang } from "../language/ast.js";
import { STATIC } from "../language/typesystem.js";

export type Form = [typeof Identifier, Lang.AST];

export const Identifier = Symbol.for("eval");

export const Is = (ast: Lang.AST): ast is Form =>
  STATIC.IsList(ast) && ast.length === 2 && ast[0] === Identifier;

export const Apply = (ctx: IContext) => async (ast: Form) => {
  const next = await ctx.eval(ctx)(ast[1]);
  if (ctx.ts.valueEquals(ast[1], next)) {
    return next;
  }
  return ctx.eval(ctx)(next);
};
