import { type AST, type List } from "./ast2.js";

/* 

combine the concept of a formal language lexer and a neural net tokenizer

1. I can simply embed the neural net tokenizer within the formal language, like this: (gpt ...)
2. I can attempt to parse with the lexer first and if there is an error, then parse with the statistical method second
3. I can do the same thing as above, but leave a "hole" where the error begins and where it ends, substituting with #1
4. I can embed the lexer within the neural net

#1 is super easy but not expressive, number #3 is the most expressive and #4 is less performant,
which actually is super important (consider the time it takes to perform tokenization in the scraper code )

We want to think of it as default to formal first. We can expand to many other languages.
Once we have a deeper understanding of transformers, we can modify the pipeline downstream as well.

(string wow its a cool day out in the world and now look at that <> I dont even care if there is no)

The issue with this is that the whitespace all of a sudden matters

*/

export const tokenizer = (source: string): string[] => source.split("");

// TODO trim spaces around brackets

/** accepts an array of tokens and returns an abstract syntax tree (AST). */
const parser = (tokens: string[], list: List, escaped = false): AST => {
  const token = tokens.shift();

  if (!token) {
    const ast = list.pop();
    if (ast !== undefined) {
      return ast;
    } else {
      throw new Error("Invalid");
    }
  }

  if (token === "\\") {
    if (escaped === false) {
      return parser(tokens, list, true);
    } else {
      return parser(tokens, list.concat(token), false);
    }
  }

  if (token === "(") {
    if (escaped === false) {
      const ast = parser(tokens, []);
      if (ast) {
        list.push(ast);
      }
      return parser(tokens, list);
    } else {
      return parser(tokens, list.concat(token), false);
    }
  }

  if (token === ")") {
    if (escaped === false) {
      return list;
    } else {
      return parser(tokens, list.concat(token), false);
    }
  }

  if (escaped === true) {
    throw new Error("invalid escape");
  }

  return parser(tokens, list.concat(token), false);

  /* if (token.startsWith('"') && token.endsWith('"')) {
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
  return parser(tokens, list.concat(Symbol(token))); */
};

export const parse = (source: string): AST => {
  const tokens = tokenizer(source);
  return parser(tokens, []);
};
