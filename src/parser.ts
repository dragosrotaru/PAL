import { AST, List } from "./ast";

type Program = string;
type Token = string;

/** accepts an array of tokens and returns an abstract syntax tree (AST). */
const ASTBuilder = (tokens: Token[], list: List): AST => {
  const token = tokens.shift();
  if (!token) {
    const ast = list.pop();
    if (ast) return ast;
    throw new Error("Invalid");
  } else if (token === "(") {
    const ast = ASTBuilder(tokens, []);
    if (ast) list.push(ast);
    return ASTBuilder(tokens, list);
  } else if (token === ")") {
    return list;
  } else {
    return ASTBuilder(tokens, list.concat(token));
  }
};

/** accepts a program and returns an array of tokens. */
const tokenizer = (source: Program): Token[] =>
  source
    .replace(/\(/g, " ( ") // convert "(x)" to "( x )"
    .trim() // remove leading / trailing whitespace
    .split(/\s+/); // split string into substrings by all forms of whitespace.

export const parse = (source: Program): AST =>
  ASTBuilder(tokenizer(source), []);
