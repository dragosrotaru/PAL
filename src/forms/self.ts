import { type Env } from "../core/environment.js";
import { IsList, type PAL } from "../languages/pal/ast.js";

export type Form = PAL;

export const Identifier = Symbol.for("self");

export const Is = (ast: PAL): boolean =>
  ast === Identifier || (IsList(ast) && ast.some(Is));

export const Apply = (env: Env) => (ast: Form) => Replace(ast, ast);

const Replace = (node: PAL, ast: Form): PAL => {
  // Base case: if node is 'self', replace with the whole AST.
  if (node === Identifier) return ast;

  // If node is an array, recursively replace 'self' in its elements.
  if (IsList(node)) {
    return node.map((subNode) => Replace(subNode, ast));
  }

  // If node is neither 'self', nor an array, nor an object, return it unchanged.
  return node;
};
