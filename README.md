# Pal

**A personal AI programming environment.** Pal is a long-running research project into what programming and personal computing could look like if they were redesigned today, with language models as a native part of the system rather than an add-on.

The core idea:

> **The environment is the filesystem. Files are values. File extensions are types. The LLM is a first-class operator.**

Pal started in 2019 as *changetheweb.xyz*, an attempt to redesign the web from first principles. Since then it has produced a series of prototypes across language design, interpreters, language servers, filesystems, peer-to-peer data models and GPU-rendered editors. This monorepo collects them. The [`notes/`](notes/) folder holds the research behind them.

## Highlights

**A Lisp whose environment is a directory on disk** ([`pal-ts/src/core/`](pal-ts/src/core)). The interpreter's environment is a reactive map, kept in two-way sync with a real folder through a filesystem watcher, with loop prevention so the two don't echo each other's writes. A file's path is its symbol and its extension is its type: drop a `.json` file in the folder and it becomes a JSON value; define a value in the REPL and it appears on disk. Any tool that can edit files can therefore take part in a Pal session: an editor, a shell, another program.

**The LLM as a language primitive** ([`pal-ts/src/specialforms/gpt.ts`](pal-ts/src/specialforms/gpt.ts)). `(gpt expr)` is a special form, not a library call. It runs a tool-calling loop over the live environment, in which the model can evaluate code (`eval`) and read values (`envget`), and returns its result as a Pal value. The model can inspect the running program it's part of. A write tool (`envset`) is declared but not yet handled.

**Two interpreters kept in agreement** ([`pal-ts/src/cross-impl.test.ts`](pal-ts/src/cross-impl.test.ts)). A Rust evaluator ([`pal-eval/`](pal-eval/)) runs alongside the TypeScript one. A cross-implementation test suite sends every expression to both and asserts their JSON outputs are identical.

**Language server in Rust** ([`pal-lsp/`](pal-lsp/)). Built on `tower-lsp` and `chumsky`, with completion, go-to-definition, find references, rename, semantic highlighting and inlay type hints, plus a VS Code client. It currently parses a placeholder grammar while the Pal grammar settles.

**WebGPU editor runtime** ([`wingman/`](wingman/)). A Rust and WebGPU renderer for a structural code editor: render pipeline, text rendering and ray-cast picking, targeting native and WASM.

**Macros and file-extension types** ([`pal-ts/src/specialforms/macro.ts`](pal-ts/src/specialforms/macro.ts), [`pal-ts/src/language/typesystem.ts`](pal-ts/src/language/typesystem.ts)). User-defined macros, and a type system in which file formats are types with their own parsers.

## Packages

| Package | Language | Status | What it is |
|---|---|---|---|
| [`pal-ts`](pal-ts/) | TypeScript | Most complete | The Lisp interpreter: filesystem-backed environment, `gpt` form, macros, REPL, web UI |
| [`pal-eval`](pal-eval/) | Rust | Working | Standalone evaluator, one S-expression in and JSON out; used for cross-implementation tests |
| [`pal-lsp`](pal-lsp/) | Rust + TS | Working | Language server and VS Code client |
| [`pal-fs-vscode`](pal-fs-vscode/) | TypeScript | Working | VS Code extension exposing a virtual `palfs://` filesystem |
| [`wingman`](wingman/) | Rust | Renders, no editing yet | WebGPU editor runtime |
| [`pal-rs`](pal-rs/) | Rust | Early prototype | Parser for `.pretty`, a component UI DSL |
| [`pal-fs`](pal-fs/) | Rust | Skeleton | FUSE filesystem to expose the environment to the OS |
| [`hyper-ts`](hyper-ts/), [`hyper-fs`](hyper-fs/) | TypeScript | Design prototype | Content-addressed, encrypted, peer-to-peer hypergraph store with petnames, and a FUSE mount over it |
| [`pal-os`](pal-os/) | Docker | Experiment | Linux From Scratch base for a Pal-native OS |
| [`pal-lsp-example`](pal-lsp-example/) | TypeScript | Template | Minimal LSP client skeleton |

## Getting started

Requires Node 22+, pnpm and Rust 1.84+. The `gpt` form needs an OpenAI API key in `.env` (see [`.env.example`](.env.example)).

```bash
pnpm install
pnpm run build          # all TypeScript packages
cargo build             # all Rust crates

cargo run -p pal-eval -- '(+ 1 2)'      # evaluate one expression in Rust
pnpm --filter pal-ts start              # start the TypeScript REPL
pnpm run test:unit                      # unit tests + TS/Rust cross-implementation suite
```

## Status

Pal is primarily a vehicle for research and learning, not a finished tool. The pieces above are independent prototypes that aren't yet wired into one runtime. [`AGENTS.md`](AGENTS.md) has a detailed map of each package, the known bugs and what's connected to what.
