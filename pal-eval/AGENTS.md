# AGENTS.md — pal-eval

> AI-audience orientation guide for the `pal-eval` Rust crate.
> @author claude

## What this is

A minimal PAL Lisp evaluator. Accepts one S-expression as a CLI argument,
evaluates it, and prints the result as JSON to stdout.

This is a standalone Rust binary — no external crate dependencies. It is
intended as a fast, embeddable evaluator for testing Pal expressions from
scripts or other processes.

## Supported forms

- Integer and boolean literals
- Arithmetic: `+`, `-`, `*`, `/`
- Comparison: `=`, `<`, `>`
- Boolean ops: `and`, `or`, `not`
- List ops: `cons`, `car`, `cdr`, `length`, `append`, `list`
- `let`: `(let ((x 1) (y 2)) (+ x y))` (parallel binding)
- `if`: `(if condition then else)`
- `quote`: `(quote (1 2 3))`
- String literals

## Output format

JSON: number, boolean, null, array, string.

## Entry points

| Task        | File          |
| ----------- | ------------- |
| Evaluator   | `src/main.rs` |

## Build

```bash
cargo build -p pal-eval
cargo run -p pal-eval -- '(+ 1 2)'
# Output: 3
```

## Status

Functional for the forms listed above. Not connected to the rest of the Pal
ecosystem — no filesystem env, no GPT, no macros.
