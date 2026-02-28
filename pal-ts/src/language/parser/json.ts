/**
 * JSON parser/serializer for the Pal AST extension Lang.JSON.
 * parse() wraps JSON.parse and returns null on error. write() is pretty-printed JSON.
 * @author claude
 */
import { log } from "../../libraries/logger/index.js";
import type { Lang } from "../ast.js";

export const parse = (input: string): Lang.JSON => {
  try {
    return JSON.parse(input);
  } catch (error: any) {
    log("parser", error.message);
    return null;
  }
};

export const write = <V extends Lang.JSON>(input: V): string => {
  return JSON.stringify(input, null, 2);
};
