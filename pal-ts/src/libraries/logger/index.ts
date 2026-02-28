/**
 * Module-level logger with static enable/disable switches per subsystem.
 * Set CONFIG[module] = true to enable logging for that subsystem; all logs go to console.log.
 * @author claude
 */
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
