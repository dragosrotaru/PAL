import { Env } from "../environment.js";
import { AST } from "./ast2.js";

interface Form {
  apply: (
    ast: AST,
    env: Env,
    evaluate?: (ast: AST, env: Env) => unknown
  ) => unknown;
}

/* 
['l','a','m','b','d','a',['x'],'x']


*/

const forms: Form[] = [
  {
    apply: (ast, env) => {
      return Symbol();
    },
  },
];

export const evaluate = (ast: AST, env: Env): unknown => {
  return forms
    .map((a) => a.apply(ast, env, evaluate))
    .filter((r) => r !== undefined);
};
