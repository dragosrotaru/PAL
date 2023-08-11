const config = {
  filesystem: false,
  parser: false,
  evaluator: false,
  env: false,
  gui: false,
  gpt: false,
};

type Module = keyof typeof config;

export const log = async (module: Module, ...args: any) => {
  if (config[module]) {
    console.log(module, ...args);
  }
};
