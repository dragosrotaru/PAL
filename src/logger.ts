import { env } from "./core/environment.js";

// todo generate these at compile time from the file with json loader.
type Module = "compiler" | "parser" | "evaluator" | "env" | "gui" | "gpt";
// todo initialize this with the json file
let config: Partial<Record<Module, boolean>> = {
  compiler: true,
  parser: false,
  evaluator: false,
  env: false,
  gui: false,
  gpt: true,
};

setTimeout(() => {
  env.subscribe(LoggerConfigID, (ast: string) => {
    config = JSON.parse(ast);
  });
}, 1000);

const LoggerConfigID = Symbol.for("logger/config.json");

export const log = (module: Module, ...args: any) => {
  if (config[module]) {
    console.log(module, ...args);
  }
};
