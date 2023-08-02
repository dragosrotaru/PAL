import { type Env } from "../language/environment.js";

export const list = (file: string, filename: string, env: Env) => {
  const rows = file.split("\n").map(Symbol);
  env.set(Symbol(filename), rows);
  rows.forEach((row) => env.set(row, null));
};
