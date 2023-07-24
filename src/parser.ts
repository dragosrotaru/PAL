import { AST, List } from "./ast";

type Program = string;
type Token = string;

/** accepts an array of tokens and returns an abstract syntax tree (AST). */
const ASTBuilder = (tokens: Token[], list: List): AST => {
  const token = tokens.shift();

  if (!token) {
    const ast = list.pop();
    if (ast !== undefined) return ast;
    throw new Error("Invalid");
  }

  if (token === "(") {
    const ast = ASTBuilder(tokens, []);
    if (ast) list.push(ast);
    return ASTBuilder(tokens, list);
  }

  if (token === ")") {
    return list;
  }

  if (token.startsWith('"') && token.endsWith('"')) {
    return ASTBuilder(tokens, list.concat(token));
  }

  if (token.startsWith("##")) {
    return ASTBuilder(tokens, list.concat(parseFloat(token.replace("##", ""))));
  }

  if (token.startsWith("#")) {
    return ASTBuilder(tokens, list.concat(parseInt(token.replace("#", ""))));
  }

  if (token === "true") {
    return ASTBuilder(tokens, list.concat(true));
  }

  if (token === "false") {
    return ASTBuilder(tokens, list.concat(false));
  }

  if (token === "null") {
    return ASTBuilder(tokens, list.concat(null));
  }

  // assume symbol
  return ASTBuilder(tokens, list.concat(Symbol(token)));
};

/** accepts a program and returns an array of tokens. */
const tokenizer = (source: Program): Token[] =>
  source
    .replace(/\(/g, " ( ") // convert "(x)" to "( x )"
    .replace(/\)/g, " ) ") // convert "(x)" to "( x )"
    .trim() // remove leading / trailing whitespace
    .split(/\s+/); // split string into substrings by all forms of whitespace.

export const parse = (source: Program): AST => {
  const tokens = tokenizer(source);
  console.log("tokens", tokens);
  return ASTBuilder(tokens, []);
};
