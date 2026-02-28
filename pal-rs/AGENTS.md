# AGENTS.md — pal-rs

> AI-audience orientation guide for the `pal-rs` Pal language compiler (Rust).
> @author claude

## What this is

A Rust crate that reads source files from a directory, parses them based on file extension,
and compiles to Rust code. Currently only the `.pretty` extension is supported.

## The "pretty" DSL

A component-based UI description language, parsed via `syn` + `proc_macro2`:

```
ComponentName[:ParentComponent] [
  property_key value;
  ChildComponent [...]
]
```

- Component names: PascalCase
- Property names: snake_case
- Properties must precede children in the body
- `if`, `map`, and string literals are parsed but return errors (not yet implemented)
- Values: currently only i32 integers; pixel/percent parsers exist but aren't wired in

## Entry Points

| Task | File |
|------|------|
| CLI | `src/main.rs` — takes a directory path, parses all files, calls compile() |
| Add a file type | `src/lib.rs` → `parse()` match arm |
| Edit DSL grammar | `src/pretty/component.rs` Parse impl |
| Add property types | `src/pretty/property.rs` → `src/pretty/value/` |

## Data Flow

```
directory path → from_filesystem() → Vec<File>
  → parse(file) [match ext] → AST::Component(Component)
  → compile(asts) [STUB — does nothing]
```

## Critical Bugs / Missing

- `ComponentIdent::to_tokens()` and `Component::to_tokens()` call `self.to_tokens()` recursively — infinite loop. Must fix before any code generation.
- `compile()` is completely empty — no code generation.
- `check()` in pretty.rs is empty — no validation.
- `if`, `map`, and string literals error out instead of being parsed.
- `Width` parser in `property/width.rs` is unused.
- Only `i32` property values supported; no strings, floats, colors, etc.

## Build

```
cargo build -p pal-rs
cargo run -p pal-rs -- <directory>
```
