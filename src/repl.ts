import repl from "repl";
import { evaluate } from "./core/evaluator.js";
import { env } from "./index.js";
import { parser } from "./languages/parser.js";

repl.start({
  prompt: "repl > ",
  eval: async (cmd, context, filename, callback) => {
    if (cmd.startsWith("ai")) {
      cmd = `(gpt "${cmd.slice(2).replace(/"/g, '\\"')}")`;
    }
    callback(null, await evaluate(env)(parser(cmd, "pal")));
  },
});
