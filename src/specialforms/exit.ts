import { IEnv } from "../interfaces.js";
import { type AST } from "../languages/ast.js";

export const Identifier = Symbol.for("exit");

export type Form = typeof Identifier;

export const Is = (ast: AST): ast is Form => ast === Identifier;

export const Apply = (env: IEnv) => (ast: Form) => process.exit(0);
