import { type IEnv } from "../../interfaces.js";
import { AST } from "../../languages/ast.js";

export const Identifier = Symbol.for("env");

export type Form = typeof Identifier;

export const Is = (ast: AST): ast is Form => ast === Identifier;

export const Apply = (env: IEnv) => (ast: Form) => env.getAll();
