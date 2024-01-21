import { log } from "../../libraries/logger/index.js";
import type { Lang } from "../ast.js";
import { STATIC } from "../typesystem.js";

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

const parseToken = (list: Lang.PAL.List, chars: string[]) => {
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
  list: Lang.PAL.List,
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
