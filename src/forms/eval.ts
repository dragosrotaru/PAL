import * as apply from "#src/forms/apply.js";
import { type AST } from "#src/language/ast.js";
import { type Env } from "#src/language/environment.js";
import { evaluate } from "#src/language/evaluator.js";

export type Form = [typeof Identifier, AST];

export const Identifier = Symbol.for("eval");

export const Is = (ast: AST): ast is Form =>
  apply.Is(ast) && ast[0] === Identifier;

export const Apply = (env: Env) => (ast: Form) => {
  return evaluate(evaluate(ast[1], env), env);
};
