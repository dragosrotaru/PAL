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
