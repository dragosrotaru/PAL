---
date: 2024-01-21
tags: [decision, wingman, pretty, rust, dsl, module-system]
summary: Explored options for .pretty multi-file module system; decided on .pretty → Rust transpile pipeline using Rust AST.
---

# .pretty module system

## Problem

Wanted to define Wingman UI components in separate `.pretty` files that get aggregated and compiled. Rust doesn't make this easy.

## Options explored

**Option A — component definition macro + build.rs mega-macro**
Issues: no chain of custody for errors (they surface in build.rs output), `include!()` import is poor UX, rust-analyzer integration is weak.

**Option B — one big file**
Avoids the problem but doesn't scale.

**Option C — virtual VSCode view over one big file**
Interesting but requires building the virtual view layer first.

**Option D — transpiler with unique file extension**
`.pretty` files import Rust code, get transpiled to Rust, then compiled. Files live side by side. The pipeline is: `build.rs → rust → binary`.

## Decision

**Option D.** `.pretty` imports Rust, `.pretty` is transpiled to Rust, Rust is compiled. Use Rust AST (not a custom AST) to avoid extra work and to benefit from the existing tooling API.

Rationale for Rust AST: avoids a lot of additional work and teaches a useful API.
