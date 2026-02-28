# AGENTS.md — pal-ts

> AI-audience orientation guide for the `pal-ts` TypeScript Lisp interpreter.
> @author claude

## What this is

A Lisp interpreter with three unique properties:

1. **`(gpt expr)` as a special form** — the LLM is a first-class language primitive, callable with eval/envget/envset tools.
2. **Filesystem-mapped environment** — every file in `test/` is a symbol in the env; file extension encodes type. Changes to files propagate to the env and vice versa.
3. **File extensions as types** — `foo.json` → JSON type, `bar.csv` → CSV type, `baz.pal` → PAL type. Type dispatch happens at parse/write time.

## Entry Points

| Task                  | Start here                                                                 |
| --------------------- | -------------------------------------------------------------------------- |
| Start the runtime     | `src/index.ts` → wires context, starts REPL                                |
| Understand evaluation | `src/core/evaluator.ts` — the `evaluate()` function                        |
| Add a special form    | Create `src/specialforms/myform.ts`, import+dispatch in `evaluator.ts`     |
| Change GPT behavior   | `src/specialforms/gpt.ts` → `callGPT()` and `Apply()`                      |
| Add a file type       | `src/language/parser/index.ts` → add to `parser()` and `writer()` dispatch |
| Change UI views       | `src/ui/web/views/`                                                        |

## Key Data Flow

```
REPL input
  → parser/pal.ts (tokenize + parse to Lang.AST)
  → evaluator.ts evaluate() (dispatch chain)
    → macro.Expand() (optional rewrite)
    → special form or apply or ID lookup
    → (gpt ...) → OpenAI API → tool call loop → result AST
  → writer() → REPL output

FileSystem.watchFileSystem()
  → file change → parser(file, ext) → env.map.set(sym, ast)
  → env observers fire → ws.send(ast) → React re-render

(ui id)
  → openGUI(id) → startServer() (lazy) → open browser
  → WebSocket Open message → env.subscribe(id) → push AST
```

## Critical Invariants

- **Never bypass the Proxy**: always use `env.map.set()` (not the underlying Map directly) to trigger observers.
- **`evaluate()` is async**: all special forms return `Promise<Lang.AST>`. Do not await results before passing to further eval.
- **No circular evaluation guard**: evaluating a symbol that maps to itself causes infinite recursion.
- **Parser is single-expression**: `parse(source)` returns one AST node. Multi-expression programs are not supported.
- **List evaluation is unordered**: `Promise.all` means side effects within a list happen in parallel.

## Type System

- `STATIC` in `typesystem.ts` = fast static guards (use these everywhere).
- `TypeSystem` class = nominal typing via symbol description suffix (`.json`, `.csv`, etc.).
- `TypeSystem.registry` = extensible runtime type guard registry (currently only bootstrapped types).
- `TSBoolean`, `TSString`, `TSNumber` in `primitives/` = not yet registered.

## Known Bugs / TODOs

- `structuralTypeOf()` always throws (broken guard condition `types.length === 0 || types.length > 0`).
- PAL parser regex bug: `/S+/` instead of `/\s+/` in empty-input detection.
- `envset` tool declared to LLM in gpt.ts but never executed when the model calls it.
- `GPTMessageHistory.append()` double-writes to env.
- `ReactDOM.render` is deprecated (React 18+); client needs upgrade to `createRoot`.
- `FileSystem.ROOT` hardcoded to `"test"`.
- `alias()` method on TypeSystem is a no-op.
- Macro expansion is non-recursive (only top-level macros are expanded).

## Extension Points

- **New file types**: add to `parser/index.ts` Clue union + parser() + writer() dispatch.
- **New special forms**: follow the `Identifier / Form / Is / Apply` pattern; add import + Is check in `evaluator.ts`.
- **New LLM tools**: add to the `functions` array in `callGPT()` and handle in the tool dispatch block in `Apply()`.
- **New type classes**: implement the interfaces in `typeclasses.ts`; register guard in `TypeSystem.bootstrap()`.
