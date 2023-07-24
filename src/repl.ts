import repl from "repl";
import { compile } from "./environment";
import { evaluate } from "./evaluator";
import { parse } from "./parser";

const env = compile();

repl.start({
  prompt: "lisp.ts > ",
  eval: (cmd, context, filename, callback) => {
    callback(null, evaluate(parse(cmd), env));
  },
});
