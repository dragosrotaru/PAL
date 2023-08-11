import { type IEnv } from "../interfaces.js";
import { AST } from "../languages/ast.js";
import { IsIdentifier, type Identifier as Id } from "../languages/pal/ast.js";
import { openGUI } from "../userinterfaces/webgui/server.js";
import * as apply from "./apply.js";

export type Form = [typeof Identifier, AST] | typeof Identifier;

export const Identifier = Symbol.for("gui");

export const Is = (ast: AST): ast is Form =>
  (apply.Is(ast) && ast[0] === Identifier) || ast === Identifier;

export const Apply = (env: IEnv) => (ast: Form) => {
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
