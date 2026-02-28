---
date: 2023-08-12
tags: [pal-ts, backlog, implementation, type-system, extensions, lisp, repl]
summary: Concrete implementation todos for the pal-ts evaluator, focused on the type system, Language Extensions, REPL, and environment management. Includes fixes (GPT history, type guards, infinite recursion), extension implementations (JSON, CSV, embedded Pal via backticks), macro system, namespace protection, and the filesystem/env impedance mismatch. Important as the specific next steps for making pal-ts production-quality.
---

# pal-ts type system implementation backlog

## Bug fixes

- Fix GPT history — not updating
- Fix GPT history — quotes around strings
- `JSON.Object` should be an opaque primitive — fix infinite recursion with `IsList`
- Fix type guard edge cases for `Is` (see design doc)

## REPL

- Update REPL to accept input type as well

## Type system and extensions

- Implement a robust guards and typechecker system
- Implement extensions for JSON and CSV to support `undefined` and Symbols
- Implement embedded Pal via backticks `` ` `` (needed anyway for quasi-quote, so also do ` ```js ` code blocks)
- Research implementing SemanticJSON — fully supports native types, represents objects as lists
- Implement more basic functions so you can write sanity tests
- Write sanity checks to verify the Lisp implementation is working as expected

## Macros and quasi-quoting

- Move quasi-special forms into stored procedures and macros where necessary
- Test out macros and fix them
- Flesh out the macro/type system implementation

## Environment and namespace

- Add a system to manage which functions to load into the environment
- Add a system to manage the namespace and protect it
- Add a rules system for managing the impedance mismatch between the filesystem model and the env model
