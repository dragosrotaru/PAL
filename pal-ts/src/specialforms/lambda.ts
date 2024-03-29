import type { IContext } from "../interfaces.js";
import type { Lang } from "../language/ast.js";
import { STATIC } from "../language/typesystem.js";

export const Identifier = Symbol.for("lambda");

export type Form = [typeof Identifier, Lang.IDList, Lang.AST];

export const Is = (ast: Lang.AST): ast is Form =>
  STATIC.IsList(ast) &&
  ast.length === 3 &&
  STATIC.IsID(ast[0]) &&
  ast[0] === Identifier &&
  STATIC.IsIDList(ast[1]);

export const Apply =
  (ctx: IContext) =>
  (ast: Form): Lang.AsyncProcedure => {
    const argsIdentifiers = ast[1];
    const body = ast[2];
    return (...values: Lang.AST[]) => {
      const env = ctx.env.extend();
      argsIdentifiers.forEach((identifier, i) =>
        env.map.set(identifier, values[i])
      );
      // todo definite trouble from this, should implement a class and have a method for extending context instead of extending just env
      return ctx.eval({ ...ctx, env })(body);
    };
  };
