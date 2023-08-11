import { log } from "../../libraries/logger/index.js";
import type { Lang } from "../ast.js";
import { STATIC } from "../typesystem.js";

/* 

<program> ::= <exp> | <program> <exp>
<exp> ::= <symbol> | <boolean> | <number> | <special> | <list> | <string>
<symbol> ::= { a-z | A-Z } <symbol> | ""
<boolean> ::= "true" | "false"
<number> ::= "#" { digit } <number> | ""
<special> ::= "null" | "undefined"
<list> ::= "(" <program> ")"
<string> ::= '"' { any character except '"' or '\' or '(', ')' unless a '\' preceeds it } '"'



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

export const write = (ast: Lang.PAL): string => {
  if (STATIC.IsString(ast)) return `"${ast.replace(/([()\\"])/g, "\\$1")}"`;
  if (STATIC.IsNumber(ast)) return ast.toString();
  if (STATIC.IsBoolean(ast)) return ast.toString();
  if (STATIC.IsNull(ast)) return "null";
  if (STATIC.IsUndefined(ast)) return "undefined";
  if (STATIC.IsList(ast))
    return ast.map(write).reduce((acc, curr, i, arr) => {
      if (arr.length === 1) return `(${curr})`;
      if (i === 0) return `(${curr}`;
      if (i === arr.length - 1) return `${acc} ${curr})`;
      return `${acc} ${curr}`;
    }, "");
  if (STATIC.IsID(ast)) {
    log("parser", ast.description);
    return ast.description || "";
  }
  if (STATIC.IsProcedure(ast)) return ast.toString();
  throw new Error(`Cannot serialize ${ast}`);
};

const parseToken = (list: Lang.List, chars: string[]) => {
  const token = chars.join("").trim();

  if (token.length === 0) return list;

  if (token.indexOf("#") === 0) {
    list.push(parseFloat(token.replace("#", "")));
    return list;
  }
  if (token === "true") {
    list.push(true);
    return list;
  }
  if (token === "false") {
    list.push(false);
    return list;
  }
  if (token === "null") {
    list.push(null);
    return list;
  }
  if (token === "undefined") {
    list.push(undefined);
    return list;
  }

  // assume symbol
  list.push(Symbol.for(token));
  return list;
};

/** accepts an array of tokens and returns an abstract syntax tree (AST). */
const parser = (
  tokens: string[],
  list: Lang.List,
  chars: string[] = [],
  stringed = false,
  escaped = false
): Lang.PAL => {
  log("parser", tokens, list, chars, stringed, escaped);
  const token = tokens.shift();
  if (token === undefined) {
    if (chars.length > 0) list = parseToken(list, chars);
    return list.pop();
  }

  if (escaped === false) {
    if (token === "\\") return parser(tokens, list, chars, stringed, true);
    if (token === '"') {
      if (stringed === true) {
        list.push(chars.join(""));
      } else {
        list = parseToken(list, chars);
      }
      return parser(tokens, list, [], !stringed);
    }

    if (stringed === false) {
      if (token === "(") {
        list = parseToken(list, chars);
        list.push(parser(tokens, []));
        return parser(tokens, list);
      }

      if (token === ")") {
        list = parseToken(list, chars);
        return list;
      }
    }
  }

  if (stringed === false) {
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
  const parsed = parser(tokens, []);
  // TODO get rid of this awful hack
  if (
    STATIC.IsList(parsed) &&
    parsed.length === 0 &&
    source.replace(/S+/g, "") !== "()"
  ) {
    return undefined;
  }
  log("parser", "ast:", parsed);
  return parsed;
};
