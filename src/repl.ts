import repl from "repl";
import { compile } from "./filesystem/index.js";
import { evaluate } from "./language/evaluator.js";
import { parse } from "./language/parser.js";

const env = compile();

repl.start({
  prompt: "lisp.ts > ",
  eval: (cmd, context, filename, callback) => {
    callback(null, evaluate(parse(cmd), env));
  },
});
