# Rust Workspace — Pal

> Overview of the Cargo workspace at `/Users/megacuck/Projects/_good_shit/pal`.
> @author claude

## Crates

| Crate               | Description                                                                        | Maturity                                                       |
| ------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `pal-rs`            | `.pretty` DSL parser → Pal language compiler targeting Rust. Uses syn/proc_macro2. | Early prototype — compile() is a stub, recursive ToTokens bug. |
| `pal-fs`            | FUSE filesystem exposing the Pal environment as a mountable virtual FS.            | Skeleton only — all FUSE methods are empty stubs.              |
| `wingman` (Prophet) | WebGPU text editor / IDE runtime. Targets native + WASM.                           | Visible rendering; no text editing.                            |
| `pal-lsp`           | Language Server Protocol implementation for Pal.                                   | Unknown — see pal-lsp/.                                        |

## Relationships

- `pal-rs` and `pal-fs` are independent; both implement the "filesystem = environment" vision at different layers.
- `wingman` is the planned native UI for the Pal programming environment.
- `pal-lsp` provides IDE integration (LSP) that would drive an editor like `wingman` or VS Code.

## Build

```bash
# All crates
cargo build

# Individual crates
cargo build -p pal-rs
cargo build -p pal-fs
cargo build -p wingman

# wingman for WASM
wasm-pack build wingman --target web
```

## Biggest Gaps

1. `pal-rs::compile()` is a stub — no code generation happens.
2. `ComponentIdent::to_tokens()` has an infinite recursion bug — must fix before any codegen.
3. `pal-fs` FUSE methods are all empty — no filesystem functionality.
4. `wingman` has no text editing, no file I/O, no connection to the Pal language runtime.
5. None of the Rust crates are wired together yet — each is a standalone experiment.
