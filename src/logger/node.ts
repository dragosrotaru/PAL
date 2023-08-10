import { env } from "../core/environment.js";

// todo generate these at compile time from the file with json loader.
type Module = "compiler" | "parser" | "evaluator" | "env" | "gui" | "gpt";
// todo initialize this with the json file
let config: Partial<Record<Module, boolean>> = {
  compiler: false,
  parser: false,
  evaluator: false,
  env: false,
  gui: false,
  gpt: false,
};

setTimeout(() => {
  env.subscribe(LoggerConfigID, (ast: string) => {
    console.log("WOWOWOW");
    config = JSON.parse(ast);
  });
}, 1000);

const LoggerConfigID = Symbol.for("logger/config.json");

export const logger = (module: Module, ...args: any) => {
  if (config[module]) {
    console.log(module, ...args);
  }
};
