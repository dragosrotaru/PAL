import { AST, List } from "./ast.js";

/* 

Lets consider the input to be constrained to ASCII, As such there are 2^8 = 256 possible values per element.

Lets look at the first layer of meaning we can discern from an input of elements, taking a scanning approach from left to right.

- value which enters a state for n predefined steps (escape character)
- value which enters and exits a state (white space)
- value which only enters or only exits a state (brackets)


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

const parseToken = (list: List, chars: string[]) => {
  const token = chars.join("").trim();
  if (token.length === 0) return list;

  if (token.startsWith("##")) {
    list.push(parseFloat(token.replace("##", "")));
  }
  if (token.startsWith("#")) {
    list.push(parseInt(token.replace("#", "")));
  }
  if (token === "true") {
    list.push(true);
  }
  if (token === "false") {
    list.push(false);
  }
  if (token === "null") {
    list.push(null);
  }
  if (token === "undefined") {
    list.push(undefined);
  }
  // assume symbol
  list.push(Symbol(token));

  return list;
};

/** accepts an array of tokens and returns an abstract syntax tree (AST). */
const parser = (
  tokens: string[],
  list: List = [],
  chars: string[] = [],
  stringed = false,
  escaped = false
): AST => {
  console.log(tokens, list, chars, stringed, escaped);
  const token = tokens.shift();
  if (!token) {
    const ast = list.pop();
    console.log(ast);
    if (ast !== undefined) {
      return ast;
    } else {
      throw new Error("Invalid");
    }
  }

  if (escaped === false) {
    if (token === "\\") return parser(tokens, list, chars, stringed, true);
    if (token === '"') {
      if (stringed) {
        list.push(chars.join(""));
      } else {
        list = parseToken(list, chars);
      }
      return parser(tokens, list, [], !stringed);
    }

    if (!stringed) {
      if (token === "(") {
        list = parseToken(list, chars);

        const ast = parser(tokens);
        if (ast) list.push(ast);

        return parser(tokens, list);
      }

      if (token === ")") {
        list = parseToken(list, chars);
        return list;
      }
    }
  }

  if (!stringed) {
    if (token === " ") {
      list = parseToken(list, chars);
      return parser(tokens, list);
    }
  }

  chars.push(token);
  return parser(tokens, list, chars, stringed);
};

/** accepts a program and returns an array of tokens. */
export const tokenizer = (source: string): string[] => source.trim().split("");

export const parse = (source: string) => {
  const tokens = tokenizer(source);
  console.log("tokens", tokens);
  return parser(tokens);
};
