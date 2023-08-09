import { AST } from "./ast.js";
import { parse as csvparser, write as csvwriter } from "./csv/parser.js";
import { parse as palparser, write as palwriter } from "./pal/parser.js";
import { parse as txtparser, write as txtwriter } from "./txt/parser.js";

const PAL = "pal";
const CSV = "csv";
const TXT = "txt";
const TEXT = "text";

type Name = typeof PAL | typeof CSV | typeof TXT | typeof TEXT;
export type FileExtension = `.${Name}`;
export type Clue = Name | FileExtension;

const is = <T extends Name>(input: Clue, type: T): input is T | `.${T}` =>
  input === type || input === "." + type;

export const parser = (input: string, clue: Clue = PAL): AST => {
  if (is(clue, "pal")) return palparser(input);
  if (is(clue, "csv")) return csvparser(input);
  if (is(clue, "txt") || is(clue, "text")) return txtparser(input);
  return txtparser(input);
};

export const writer = (input: any, clue: Clue = PAL): string => {
  if (is(clue, "pal")) return palwriter(input);
  if (is(clue, "csv")) return csvwriter(input);
  if (is(clue, "txt") || is(clue, "text")) return txtwriter(input);
  return txtparser(input);
};
