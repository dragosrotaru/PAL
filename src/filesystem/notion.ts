import { Env } from "#src/language/environment.js";
import { Client } from "@notionhq/client";
import fs from "fs";
import path from "path";
import { parseCSV } from "./csv.js";

// Initializing a client
export const client = new Client({
  auth: process.env.NOTION_TOKEN,
});

const importNotion = (env: Env, filepath: string) => {
  if (fs.statSync(filepath).isDirectory()) {
    const files = fs.readdirSync(filepath);
    files.forEach((filepath) => importNotion(env, filepath));

    const csvfilepath = [filepath, "csv"].join(".");
    const csv = parseCSV(fs.readFileSync(csvfilepath, "utf-8"));
  }

  const filename = path.basename(filepath);
  const ext = path.extname(filepath);
  if (ext !== "md") throw new Error("unexpected file extension");
};
