import fs from "fs";
import path from "path";
import { Env } from "../language/environment.js";
import { list } from "./list.js";

export const rootPath = path.join("");

export const compile = () => {
  const env = new Env();
  const filepath = "test/countries.list";
  const filename = path.basename(filepath);
  const ext = path.extname(filepath);
  const file = fs.readFileSync(path.join(rootPath, filepath), "utf-8");

  if (ext === "list") {
    list(file, filename, env);
  }
  if (ext === "md") {
  }

  return env;
};
