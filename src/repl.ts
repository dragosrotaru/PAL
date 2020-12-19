import repl from "repl";
import { parse } from "./parser";
import { evaluator } from "./evaluator";

repl.start({
  prompt: "lisp.ts > ",
  eval: (cmd, context, filename, callback) => {
    callback(null, evaluator(parse(cmd)));
  },
});
