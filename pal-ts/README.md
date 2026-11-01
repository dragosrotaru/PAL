# pal-ts

The TypeScript implementation of the Pal Lisp, and the most complete part of [Pal](../README.md).

```lisp
(env/set greeting "hello")         ; also written to test/greeting on disk
(gpt "summarize the files in the environment")
```

## What makes it different

- **The environment is a directory.** [`core/environment.ts`](src/core/environment.ts) is a reactive map that emits events on every change. [`core/filesystem.ts`](src/core/filesystem.ts) keeps it in two-way sync with a folder on disk (currently [`test/`](test/)): editing a file updates the running program, and defining a value writes a file.
- **File extensions are types.** The extension decides how a file is parsed into a value (Pal source, JSON, CSV, plain text, and user-defined types such as the `music/` example in `test/`). See [`language/typesystem.ts`](src/language/typesystem.ts).
- **`gpt` is a special form.** [`specialforms/gpt.ts`](src/specialforms/gpt.ts) runs a tool-calling loop in which the model can `eval` code and read environment values (`envget`); an `envset` tool is declared but not yet handled. Conversation history is itself stored in the environment, so it can be edited like any other file.
- **Macros** ([`specialforms/macro.ts`](src/specialforms/macro.ts)) and a small standard library of list functions ([`libraries/functions/`](src/libraries/functions)).

## Layout

```
src/
  core/          evaluator, reactive environment, filesystem sync, message history
  language/      S-expression parser, AST, type system and typeclasses
  specialforms/  quote, lambda, macro, eval, apply, parse, gpt, ui, ...
  libraries/     standard functions, OpenAI client, logger
  ui/            terminal REPL and web UI
  eval-cli.ts    single-expression evaluator used by the cross-implementation tests
```

## Run

```bash
pnpm install                 # from the repository root
pnpm --filter pal-ts start   # build and start the REPL (watches ./test)
pnpm run test:unit           # from the root: unit tests + TS/Rust cross-implementation suite
```

The `gpt` form reads `OPENAI` from the root `.env`.

## License

GPL-3.0, see [LICENSE](LICENSE).
