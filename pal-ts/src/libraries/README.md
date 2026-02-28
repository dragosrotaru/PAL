# libraries/

Standard library modules for GPT integration, logging, and built-in list/number functions.

## Components

| Dir/File | Purpose |
|----------|---------|
| `gpt/index.ts` | OpenAI API singleton, token counter, code-block extractor, and typed request helpers (requestGPT, requestCode, requestJSON, requestJavascript). |
| `gpt/system-prompt.md` | System prompt file; synced to env via FileSystem and read by GPTMessageHistory. |
| `logger/index.ts` | Module-scoped logger with static CONFIG flags per subsystem; all output to console.log. |
| `functions/list.ts` | Lisp list primitives: cons, car, cdr, length, append — with JSDoc, not yet registered as env functions. |
| `functions/number.ts` | Arithmetic functions: add, subtract, multiply, divide, gt, lt — divide guards against /0, unlike the type class version. |

## Missing Pieces

- `functions/list.ts` and `functions/number.ts` define standalone TS functions but are never registered into the Pal environment or type system.
- Logger CONFIG is a compile-time constant — no runtime way to enable/disable logging.
- `requestGPT` is hardcoded to `"gpt-4"` while `callGPT` in gpt.ts uses `"gpt-3.5-turbo-16k-0613"`.

@author claude
