import repl from "repl";
import { env } from "./core/environment.js";
import { evaluate } from "./core/evaluator.js";
import { parser } from "./languages/parser.js";

repl.start({
  prompt: "repl > ",
  eval: async (cmd, context, filename, callback) => {
    if (cmd.startsWith("ai")) {
      cmd = `(gpt "${cmd.slice(2, 0).replace('"', '\\"')}")`;
    }
    callback(null, await evaluate(env)(parser(cmd, "pal")));
  },
});
