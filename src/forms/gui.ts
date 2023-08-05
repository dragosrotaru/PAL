import * as apply from "#src/forms/apply.js";
import { openGUI } from "#src/gui/server.js";
import { type AST } from "#src/language/ast.js";
import { type Env } from "#src/language/environment.js";

export type Form = [typeof Identifier, AST];

export const Identifier = Symbol.for("gui");

export const Is = (ast: AST): ast is Form =>
  apply.Is(ast) && ast[0] === Identifier;

export const Apply = (env: Env) => (ast: Form) => {
  openGUI(ast[1], env);
  return undefined;
};
