import { evaluate } from "../core/evaluator.js";
import type { IEnv } from "../interfaces.js";
import type { Lang } from "../language/ast.js";
import { STATIC } from "../language/typesystem.js";

export type Form = [typeof Identifier, Lang.AST];

export const Identifier = Symbol.for("eval");

export const Is = (ast: Lang.AST): ast is Form =>
  STATIC.IsList(ast) && ast.length === 2 && ast[0] === Identifier;

export const Apply = (env: IEnv) => async (ast: Form) =>
  evaluate(env)(await evaluate(env)(ast[1]));
