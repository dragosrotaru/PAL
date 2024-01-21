import type { Lang } from "../ast.js";

const NEWLINE = "\n";
const DELIMITER = ",";
const QUOTE = '"';
const EMPTY = "";

/* 
- skips empty lines
- trims whitespace on value
- does not enforce header or shape rules
- handles double quotes, uses double double quotes "" to escape double quotes

*/

const parseAtom = (value: string): Lang.CSV.Atom => {
  value = value.trim();
  if (value.includes(QUOTE))
    value = value.replace(new RegExp(QUOTE + QUOTE, "g"), QUOTE);

  if (!isNaN(Number(value))) return parseFloat(value);
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;
  return value;
};

const parseRow = (value: string): Lang.CSV.Row => {
  const row: Lang.CSV.Row = [];
  let current = EMPTY;
  let withinQuotes = false;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    if (char === QUOTE) {
      withinQuotes = !withinQuotes;
      continue;
    }

    if (char === DELIMITER && withinQuotes === false) {
      row.push(parseAtom(current));
      current = EMPTY;
      continue;
    }

    current += char;
  }

  row.push(parseAtom(current));
  return row;
};

export const parse = (input: string): Lang.CSV => {
  const lines = input.split(NEWLINE);

  if (lines.length === 0) return [];

  const csv: Lang.CSV = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === EMPTY) continue; // Skip empty lines
    csv.push(parseRow(line));
  }

  return csv;
};

const writeAtom = (value: Lang.CSV.Atom): string => {
  if (typeof value === "number") return value.toString();
  if (typeof value === "boolean") return value.toString();

  // Add quotes if value contains special characters
  if (
    value.includes(DELIMITER) ||
    value.includes(NEWLINE) ||
    value.includes(QUOTE)
  ) {
    // Escape any quotes inside the value
    value = value.replace(new RegExp(QUOTE, "g"), QUOTE + QUOTE);
    return QUOTE + value + QUOTE;
  }

  return value;
};

export const write = (input: Lang.CSV): string =>
  input.map((row) => row.map(writeAtom).join(DELIMITER)).join(NEWLINE);
