const config = {
  compiler: true,
  parser: false,
  evaluator: true,
  env: false,
  gui: false,
} as const;
type Module = keyof typeof config;

export const log = (module: Module, ...args: any) => {
  if (config[module]) {
    console.log(module, ...args);
  }
};
