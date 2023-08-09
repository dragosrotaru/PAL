import * as apply from "../forms/apply.js";
import { openGUI } from "../gui/server.js";
import { type Env } from "../language-core/environment.js";
import {
  IsIdentifier,
  type Identifier as Id,
  type PAL,
} from "../languages/pal/ast.js";

export type Form = [typeof Identifier, PAL] | typeof Identifier;

export const Identifier = Symbol.for("gui");

export const Is = (ast: PAL): ast is Form =>
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
