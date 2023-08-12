const CONFIG = {
  filesystem: false,
  parser: false,
  evaluator: true,
  env: false,
  gui: false,
  gpt: true,
};

type Module = keyof typeof CONFIG;

export const log = async (module: Module, ...args: any) => {
  if (CONFIG[module]) {
    console.log(module, ...args);
  }
};
