import * as apply from "#src/forms/apply.js";
import { openGUI } from "#src/gui/server.js";
import {
  IsIdentifier,
  type AST,
  type Identifier as Id,
} from "#src/language/ast.js";
import { type Env } from "#src/language/environment.js";

export type Form = [typeof Identifier, AST] | typeof Identifier;

export const Identifier = Symbol.for("gui");

export const Is = (ast: AST): ast is Form =>
  (apply.Is(ast) && ast[0] === Identifier) || ast === Identifier;

export const Apply = (env: Env) => (ast: Form) => {
  if (ast === Identifier) {
    openGUI(Symbol(), env);
    return undefined;
  }
  let id: Id;
  if (!IsIdentifier(ast[1])) {
    id = Symbol.for(crypto.randomUUID());
    env.map.set(id, ast[1]);
  } else {
    id = ast[1];
  }
  openGUI(id, env);
  return undefined;
};
