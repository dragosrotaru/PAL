import { CSV } from "./csv/ast.js";
import { PAL } from "./pal/ast.js";
import { TXT } from "./txt/ast.js";

export type AST = PAL | CSV | TXT;
