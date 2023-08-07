const config = {
  compiler: false,
  parser: false,
  evaluator: false,
  env: true,
  gui: true,
} as const;
type Module = keyof typeof config;

export const log = (module: Module, ...args: any) => {
  if (config[module]) {
    console.log(module, ...args);
  }
};
