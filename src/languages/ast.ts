import { type CSV } from "./csv/ast.js";
import { type PAL } from "./pal/ast.js";
import { type TXT } from "./txt/ast.js";

export type AST = PAL | CSV | TXT;
