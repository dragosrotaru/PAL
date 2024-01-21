import repl from "repl";
import type { IContext } from "../interfaces.js";
import { parser } from "../language/parser/index.js";

export const StartRepl = (ctx: IContext) => {
  repl.start({
    prompt: "repl > ",
    eval: async (cmd, context, filename, callback) => {
      if (cmd.startsWith("ai")) {
        cmd = `(gpt "${cmd.slice(2).replace(/"/g, '\\"').trim()}")`;
      }
      callback(null, await ctx.eval(ctx)(parser(cmd, "pal")));
    },
  });
};
