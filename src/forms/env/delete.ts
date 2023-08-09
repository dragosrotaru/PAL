import { type Env } from "../../language-core/environment.js";
import {
  IsIdentifierList,
  type Identifier as IDType,
  type PAL,
} from "../../languages/pal/ast.js";

export const Identifier = Symbol.for("env/delete");

export type Form = [typeof Identifier, IDType];

export const Is = (ast: PAL): ast is Form =>
  IsIdentifierList(ast) && ast.length === 2 && ast[0] === Identifier;

export const Apply = (env: Env) => (ast: Form) => {
  return env.map.delete(ast[1]);
};
