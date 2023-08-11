import { type IEnv } from "../interfaces.js";
import { type AST } from "../languages/ast.js";
import { IsList } from "../languages/pal/ast.js";

export type Form = AST;

export const Identifier = Symbol.for("self");

export const Is = (ast: AST): boolean =>
  ast === Identifier || (IsList(ast) && ast.some(Is));

export const Apply = (env: IEnv) => (ast: Form) => Replace(ast, ast);

const Replace = (node: AST, ast: Form): AST => {
  // Base case: if node is 'self', replace with the whole AST.
  if (node === Identifier) return ast;

  // If node is an array, recursively replace 'self' in its elements.
  if (IsList(node)) {
    return node.map((subNode) => Replace(subNode, ast));
  }

  // If node is neither 'self', nor an array, nor an object, return it unchanged.
  return node;
};
