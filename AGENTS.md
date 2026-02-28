# AGENTS.md — Pal

> AI-audience orientation guide for the entire Pal project.
> @author claude

## What is Pal?

Pal is a **personal AI programming environment** — a re-imagination of personal computing.
It started in 2019 as `changetheweb.xyz`, a research project to redesign the web from scratch. After years of exploration across a wide range of domains (P2P, CRDTs, hypergraphs,
Lisp, WebGPU, FUSE filesystems, LSP, LLMs), the project has evolved into a collection
of experimental sub-systems converging around a core vision:

> **The environment is the filesystem. Files are values. Extensions are types. The LLM is a first-class operator.**

## Core vision (in one paragraph)

Pal is a Lisp interpreter where:

- The **environment** is a reactive, pub/sub map backed by a real directory on disk.
- **File path = Symbol key; file extension = type**. Writing a `.json` file creates a JSON value; a `.ts` file creates code.
- **`(gpt expr)`** is a first-class special form that calls an LLM and returns the result as a value.
- Any tool that can read/write files can interact with the Pal environment (FUSE, VS Code, a terminal).
- The IDE (`wingman`) renders the environment using WebGPU.

## Sub-projects overview

| Project                                           | Language   | Status            | Purpose                                                                          |
| ------------------------------------------------- | ---------- | ----------------- | -------------------------------------------------------------------------------- |
| [`pal-ts/`](pal-ts/AGENTS.md)                     | TypeScript | Most complete     | Lisp interpreter with GPT, filesystem-mapped env, web UI                         |
| [`pal-rs/`](pal-rs/AGENTS.md)                     | Rust       | Early prototype   | `.pretty` DSL parser → Rust codegen (`compile()` is a stub)                      |
| [`pal-eval/`](pal-eval/AGENTS.md)                 | Rust       | Functional        | Standalone Lisp evaluator: one S-expr in, JSON out (no deps)                    |
| [`pal-fs/`](pal-fs/AGENTS.md)                     | Rust       | Skeleton          | FUSE filesystem (fuser crate) — all methods are stubs                            |
| [`wingman/`](wingman/AGENTS.md)                   | Rust       | Visible rendering | WebGPU text editor / IDE runtime (no text editing yet)                           |
| [`pal-lsp/`](pal-lsp/AGENTS.md)                   | Rust + TS  | Working LSP       | Language server for `.pretty`/`.pal` files (chumsky parser, not Pal grammar yet) |
| [`pal-fs-vscode/`](pal-fs-vscode/AGENTS.md)       | TypeScript | Working           | VS Code extension: in-memory virtual filesystem (`palfs://`)                     |
| [`hyper-ts/`](hyper-ts/AGENTS.md)                 | TypeScript | Broken build      | P2P encrypted hypergraph DB core library (missing module impls)                  |
| [`hyper-fs/`](hyper-fs/AGENTS.md)                 | TypeScript | Broken build      | FUSE filesystem over hyper-ts (blocked by same missing module impls)             |
| [`pal-os/`](pal-os/AGENTS.md)                     | Dockerfile | Incomplete        | Linux From Scratch starting point for a custom Pal OS                            |
| [`pal-lsp-example/`](pal-lsp-example/AGENTS.md)   | TypeScript | Template          | Minimal VS Code LSP client skeleton (server command is empty)                    |

## Architecture layers

```
┌─────────────────────────────────────────────────────────────────┐
│  UI layer                                                        │
│  wingman (WebGPU native)  │  pal-ts web (React/WebSocket)        │
│  pal-fs-vscode (VS Code virtual filesystem extension)            │
├─────────────────────────────────────────────────────────────────┤
│  Language / IDE layer                                            │
│  pal-lsp (LSP server)     │  pal-lsp/client (LSP VS Code ext)    │
│  pal-rs (.pretty DSL)     │  pal-ts/language (S-expr parser)     │
│  pal-lsp-example (LSP client stub)                               │
├─────────────────────────────────────────────────────────────────┤
│  Runtime / Environment layer                                     │
│  pal-ts (Lisp evaluator + reactive Env + GPT special form)       │
│  pal-eval (standalone Lisp eval — no deps, JSON out)             │
│  pal-rs::compile() [STUB] │  pal-ts::FileSystem (chokidar)       │
├─────────────────────────────────────────────────────────────────┤
│  Filesystem layer                                                │
│  pal-fs (FUSE via fuser — stubs)                                 │
│  hyper-fs (FUSE via fuse-native — broken build)                  │
├─────────────────────────────────────────────────────────────────┤
│  Data layer                                                      │
│  hyper-ts (HyperGraph, HyperNode, HyperEdge, encryption)         │
│  pal-ts Env (reactive Map<Symbol, AST>)                          │
└─────────────────────────────────────────────────────────────────┘
```

## The "pretty" DSL

The `.pretty` file extension defines the Pal component UI DSL, parsed by `pal-rs`:

```
ComponentName[:ParentComponent] [
  property_key value;
  ChildComponent [...]
]
```

- Component names: PascalCase
- Property names: snake_case
- `pal-lsp` provides IDE support for `.pretty` files

## Known critical bugs

| Location                            | Bug                                                                                                            |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `pal-rs/src/pretty/component.rs`    | `ComponentIdent::to_tokens()` and `Component::to_tokens()` call `self.to_tokens()` recursively → infinite loop |
| `pal-rs/src/lib.rs`                 | `compile()` is completely empty — no Rust codegen happens                                                      |
| `pal-ts/src/language/typesystem.ts` | `structuralTypeOf` guard always returns `true` (broken condition)                                              |
| `pal-ts/src/language/parser/pal.ts` | Regex `/S+/` should be `/\s+/`                                                                                 |
| `pal-ts/src/core/messageHistory.ts` | `append()` writes to env AND disk separately — potential double-write inconsistency                            |
| `pal-lsp/src/main.rs`               | Inlay hints use hardcoded location `(0,4)-(0,5)` instead of actual span                                        |
| `pal-lsp/client/src/extension.ts`   | `helloWorld` command hardcodes dev machine's absolute path                                                     |

## Entry points for common tasks

| Task                    | Where to start                                                      |
| ----------------------- | ------------------------------------------------------------------- |
| Run the Lisp REPL       | `pal-ts/`: `pnpm run build && node build/index.js < /dev/null`      |
| Evaluate one S-expr     | `pal-eval/`: `cargo run -p pal-eval -- '(+ 1 2)'`                   |
| Parse a `.pretty` file  | `pal-rs/`: `cargo run -p pal-rs -- <directory>`                     |
| Start the LSP server    | `pal-lsp/`: `cargo run -p pal-lsp`                                  |
| Mount a FUSE filesystem | `hyper-fs/`: `pnpm run build && node build/index.js <pass> <config>`|
| Launch the WebGPU IDE   | `wingman/`: `cargo run -p wingman`                                  |

#
## What's NOT connected yet

- None of the Rust crates are wired together (pal-rs, pal-fs, pal-eval, wingman are independent).
- pal-ts and pal-rs are parallel implementations — no shared runtime.
- pal-eval (Rust Lisp) and pal-ts (TS Lisp) are separate, incompatible evaluators.
- pal-lsp uses a tutorial parser ("Nano Rust"), not the actual Pal grammar.
- pal-os is a Docker LFS experiment with no Pal-specific content yet.
- hyper-ts / hyper-fs (P2P, network) are not connected to pal-ts (Lisp runtime).
- hyper-ts build is broken — several dependency modules were never implemented.
