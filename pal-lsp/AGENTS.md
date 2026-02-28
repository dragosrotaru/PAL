# AGENTS.md — pal-lsp

> AI-audience orientation guide for the `pal-lsp` Language Server.
> @author claude

## What this is

A Language Server Protocol (LSP) server for the Pal language (`.pretty`, `.pal` files).
Written in Rust using `tower-lsp` (async LSP framework) and `chumsky` (parser combinators).
Communicates with the editor over stdin/stdout via JSON-RPC.

A companion VS Code **client** extension lives in `client/src/extension.ts` and spawns this
binary as a child process.

## Architecture

```
stdin/stdout JSON-RPC
  └── tower-lsp Server
        └── Backend  (main.rs)
              ├── document_map: DashMap<url, Rope>          live source text
              ├── ast_map:      DashMap<url, HashMap<fn,Func>>  latest AST
              └── semantic_token_map: DashMap<url, Vec<ImCompleteSemanticToken>>
```

## Module layout

| File                      | Purpose                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| `src/main.rs`             | LSP server binary: `Backend` struct, all LSP handler impls, `on_change`, `offset_to_position` |
| `src/lib.rs`              | Library re-exports: `chumsky`, `completion`, `jump_definition`, `reference`, `semantic_token` |
| `src/chumsky.rs`          | Lexer + AST + parser (`funcs_parser`) + `type_inference` + `parse` entry point                |
| `src/completion.rs`       | Collect in-scope symbols at cursor offset                                                     |
| `src/jump_definition.rs`  | Go-to-definition: resolve offset → declaration site                                           |
| `src/reference.rs`        | Find-all-references / rename: collect all use sites of a symbol                               |
| `src/semantic_token.rs`   | `LEGEND_TYPE` constant + AST→semantic-token conversion                                        |
| `client/src/extension.ts` | VS Code client extension: spawns server, registers for `.pretty` / `.pal`                     |

## Language (chumsky.rs)

The parser implements a "Nano Rust" / "Foo" language (chumsky tutorial origin).
This is **not yet wired to the actual Pal Lisp grammar** — it is a placeholder.

Grammar summary:

- Top-level: `fn name(args) { body }`
- Expressions: literals, identifiers, `let x = e; rest`, `if cond { a } else { b }`, binary ops, calls, lists
- Keywords: `fn`, `let`, `print`, `if`, `else`
- Operators: `+`, `-`, `*`, `/`, `==`, `!=`
- Comments: `// single-line`

## LSP capabilities

| Capability                     | File                                                                 | Notes                                         |
| ------------------------------ | -------------------------------------------------------------------- | --------------------------------------------- |
| Text sync (full)               | `main.rs::on_change`                                                 | Triggered by `did_open` and `did_change`      |
| Go-to-definition               | `main.rs::goto_definition` + `jump_definition.rs`                    |                                               |
| Find references                | `main.rs::references` + `reference.rs`                               |                                               |
| Semantic tokens (full + range) | `main.rs::semantic_tokens_full/range`                                | Delta-encoded from `semantic_token_map`       |
| Inlay hints                    | `main.rs::inlay_hint`                                                | Shows inferred type labels for `let` bindings |
| Completion                     | `main.rs::completion` + `completion.rs`                              | In-scope variables and functions              |
| Rename                         | `main.rs::rename` + `reference.rs::get_reference(include_self=true)` |                                               |
| Execute command                | `main.rs::execute_command`                                           | Stub — "dummy.do_something" only              |

## Entry points

| Task                      | Where                                                                         |
| ------------------------- | ----------------------------------------------------------------------------- |
| Build server              | `cargo build -p pal-lsp`                                                      |
| Run server (stdin/stdout) | `cargo run -p pal-lsp`                                                        |
| Parse a file              | `chumsky::parse(src)` → `ParserResult { ast, parse_errors, semantic_tokens }` |
| Add a new LSP handler     | Implement in `main.rs` in the `LanguageServer` impl block                     |
| Add AST node type         | `chumsky.rs::Expr` enum                                                       |

## Key data structures

```rust
// One token classification for semantic highlighting
ImCompleteSemanticToken { start: usize, length: usize, token_type: usize }

// Top-level function node
Func { name: Spanned<String>, args: Vec<Spanned<String>>, body: Spanned<Expr>, span: Span }

// Expression node
Expr { Error | Value(Value) | List | Local | Let | Then | Binary | Call | If | Print }
```

## Known issues / missing pieces

- The chumsky parser implements a generic tutorial language — not the actual Pal Lisp grammar.
  The real `.pretty` DSL (component tree syntax) is implemented separately in `pal-rs/src/pretty/`.
- `execute_command` is a stub that only calls `apply_edit(default())`.
- The VS Code client's `helloworld.helloWorld` command hardcodes an absolute path on the
  developer's machine (`/User/megacuck/projects/pal/pal-lsp/test.pretty`).
- `activateInlayHints` in the client extension is defined but never called; its provider
  body is fully commented out.
- Inlay hints use a hardcoded location range `(0,4)-(0,5)` instead of the actual span.

## Build

```bash
# Server binary
cargo build -p pal-lsp

# Client extension (from pal-lsp/ directory)
npm install
npx webpack
# Then install the built .vsix or launch via VS Code launch.json
```
