const config = {
  compiler: false,
  parser: false,
  evaluator: false,
  env: false,
  gui: false,
  gpt: false,
} as const;
type Module = keyof typeof config;

export const log = (module: Module, ...args: any) => {
  if (config[module]) {
    console.log(module, ...args);
  }
};
