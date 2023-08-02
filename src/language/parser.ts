import { AST, List } from "./ast.js";

/** accepts an array of tokens and returns an abstract syntax tree (AST). */
const parser = (tokens: string[], list: List): AST => {
  const token = tokens.shift();
  if (!token) {
    const ast = list.pop();
    if (ast !== undefined) return ast;
    throw new Error("Invalid");
  }
  if (token === "(") {
    const ast = parser(tokens, []);
    if (ast) list.push(ast);
    return parser(tokens, list);
  }
  if (token === ")") {
    return list;
  }
  if (token.startsWith('"') && token.endsWith('"')) {
    return parser(tokens, list.concat(token.slice(1, -1)));
  }
  if (token.startsWith("##")) {
    return parser(tokens, list.concat(parseFloat(token.replace("##", ""))));
  }
  if (token.startsWith("#")) {
    return parser(tokens, list.concat(parseInt(token.replace("#", ""))));
  }
  if (token === "true") {
    return parser(tokens, list.concat(true));
  }
  if (token === "false") {
    return parser(tokens, list.concat(false));
  }
  if (token === "null") {
    return parser(tokens, list.concat(null));
  }
  if (token === "undefined") {
    return parser(tokens, list.concat(undefined));
  }
  // assume symbol
  return parser(tokens, list.concat(Symbol(token)));
};

/** accepts a program and returns an array of tokens. */
const tokenizer = (source: string) =>
  source
    .replace(/\(/g, " ( ") // convert "(x)" to "( x )"
    .replace(/\)/g, " ) ") // convert "(x)" to "( x )"
    .trim() // remove leading / trailing whitespace
    .split(/\s+/); // split string into substrings by all forms of whitespace.

export const parse = (source: string) => {
  const tokens = tokenizer(source);
  console.log("tokens", tokens);
  return parser(tokens, []);
};
