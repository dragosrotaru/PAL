const CONFIG = {
  filesystem: false,
  parser: false,
  evaluator: false,
  env: false,
  gui: true,
  gpt: false,
};

type Module = keyof typeof CONFIG;

export const log = async (module: Module, ...args: any) => {
  if (CONFIG[module]) {
    console.log(module, ...args);
  }
};
