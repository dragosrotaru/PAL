import repl from "repl";
import { evaluate } from "./core/evaluator.js";
import { compile } from "./filesystem/index.js";
import { parser, writer } from "./languages/parser.js";

const env = compile();

repl.start({
  prompt: "repl > ",
  eval: async (cmd, context, filename, callback) => {
    callback(null, writer(await evaluate(env)(parser(cmd, "pal"))));
  },
});
