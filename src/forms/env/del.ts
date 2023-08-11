import { type IEnv } from "../../interfaces.js";
import { type AST } from "../../languages/ast.js";
import {
  IsIdentifierList,
  type Identifier as IDType,
} from "../../languages/pal/ast.js";

export const Identifier = Symbol.for("env/del");

export type Form = [typeof Identifier, IDType];

export const Is = (ast: AST): ast is Form =>
  IsIdentifierList(ast) && ast.length === 2 && ast[0] === Identifier;

export const Apply = (env: IEnv) => (ast: Form) => {
  return env.map.delete(ast[1]);
};
