import repl from "repl";
import { evaluate } from "../core/evaluator.js";
import { type IEnv } from "../interfaces.js";
import { parser } from "../language/parser/index.js";

export const StartRepl = (env: IEnv) => {
  repl.start({
    prompt: "repl > ",
    eval: async (cmd, context, filename, callback) => {
      if (cmd.startsWith("ai")) {
        cmd = `(gpt "${cmd.slice(2).replace(/"/g, '\\"')}")`;
      }
      callback(null, await evaluate(env)(parser(cmd, "pal")));
    },
  });
};
