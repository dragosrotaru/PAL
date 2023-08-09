import repl from "repl";
import { compile } from "./filesystem/index.js";
import { evaluate } from "./language-core/evaluator.js";
import { parser } from "./languages/parser.js";

const env = compile();

repl.start({
  prompt: "repl > ",
  eval: async (cmd, context, filename, callback) => {
    callback(null, await evaluate(env)(parser(cmd, "pal")));
  },
});
