import type { IEnv } from "../interfaces.js";
import type { Lang } from "../language/ast.js";
import { STATIC } from "../language/typesystem.js";

export type Form = Lang.AST;

export const Identifier = Symbol.for("self");

export const Is = (ast: Lang.AST): boolean =>
  ast === Identifier || (STATIC.IsList(ast) && ast.some(Is));

export const Apply = (env: IEnv) => (ast: Form) => Replace(ast, ast);

const Replace = (node: Lang.AST, ast: Form): Lang.AST => {
  // Base case: if node is 'self', replace with the whole AST.
  if (node === Identifier) return ast;

  // If node is an array, recursively replace 'self' in its elements.
  if (STATIC.IsList(node)) {
    return node.map((subNode) => Replace(subNode, ast));
  }

  // If node is neither 'self', nor an array, nor an object, return it unchanged.
  return node;
};
