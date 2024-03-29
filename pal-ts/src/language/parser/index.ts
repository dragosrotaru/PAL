import type { Lang } from "../ast.js";
import { parse as csvparser, write as csvwriter } from "./csv.js";
import { parse as jsonparser, write as jsonwriter } from "./json.js";
import { parse as palparser, write as palwriter } from "./pal.js";

const PAL = "pal";
const CSV = "csv";
const TXT = "txt";
const TEXT = "text";
const JSON = "json";

type Name = typeof PAL | typeof CSV | typeof TXT | typeof TEXT | typeof JSON;
export type FileExtension = `.${Name}`;
export type Clue = Name | FileExtension;

const is = <T extends Name>(input: Clue, type: T): input is T | `.${T}` =>
  input === type || input === "." + type;

export const parser = (input: string, clue: Clue = PAL): Lang.AST => {
  if (is(clue, "pal")) return palparser(input);
  if (is(clue, "csv")) return csvparser(input);
  if (is(clue, "json")) return jsonparser(input);
  if (is(clue, "txt") || is(clue, "text")) return input;
  return palparser(input);
};

export const writer = (input: any, clue: Clue = PAL): string => {
  if (is(clue, "pal")) return palwriter(input);
  if (is(clue, "csv")) return csvwriter(input);
  if (is(clue, "json")) return jsonwriter(input);
  if (is(clue, "txt") || is(clue, "text")) return input;
  return palwriter(input);
};
