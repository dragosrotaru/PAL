import repl from "repl";
import { compile } from "./filesystem/index.js";
import { evaluate } from "./language/evaluator.js";
import { parse } from "./language/parser.js";

const env = compile();
repl.start({
  prompt: "> ",
  eval: async (cmd, context, filename, callback) => {
    callback(null, await evaluate(env)(parse(cmd)));
  },
});
