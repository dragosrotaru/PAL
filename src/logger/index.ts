import config from "./config.json" assert { type: "json" };

type Module = keyof typeof config;

export const log = async (module: Module, ...args: any) => {
  if (config[module]) {
    console.log(module, ...args);
  }
};
