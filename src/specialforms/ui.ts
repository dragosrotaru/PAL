import path from "path";
import type { IEnv } from "../interfaces.js";
import type { Lang } from "../language/ast.js";
import { STATIC } from "../language/typesystem.js";
import { openGUI } from "../ui/web/server.js";
import * as apply from "./apply.js";

export type Form = [typeof Identifier, Lang.AST] | typeof Identifier;

export const Identifier = Symbol.for("ui");

export const Is = (ast: Lang.AST): ast is Form =>
  (apply.Is(ast) && ast[0] === Identifier) || ast === Identifier;

export const Apply = (env: IEnv) => (ast: Form) => {
  if (ast === Identifier) {
    openGUI(Symbol(), env);
    return undefined;
  }
  let id: Lang.ID;
  if (!STATIC.IsID(ast[1])) {
    id = Symbol.for(path.join("ui", crypto.randomUUID()));
    env.map.set(id, ast[1]);
  } else {
    id = ast[1];
  }
  openGUI(id, env);
  return undefined;
};
