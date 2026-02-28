---
date: 2023-08-04
tags: [pal-ts, backlog, implementation, gui, parsing, evaluation, filesystem, language-server]
summary: Implementation task list for pal-ts across six areas: GUI (styling, save/undo/redo, view/edit capabilities), parsing (multi-statement, streaming, non-ASCII), environment (dynamic scoping, Gödel numbering), evaluation (generic pattern-matcher, lazy eval, metacircular, JIT), filesystem (namespace transformations), and new features (CLI, GC, memoization, LSP, git integration). Important as the active development roadmap for the core Lisp runtime.
---

# pal-ts implementation task list

## Useability

- add Notion import/integration to use with personal data

## GUI

- dynamically template client file location into index.html in the GUI server
- add basic style
- show if object is ephemeral or persisted
- add save, rename, undo/redo, execute, navigate-to, navigate-within capabilities
- view capability: filter, sort, scroll through view variants
- edit capability: structured text edit, drag to rearrange
- add authentication/security to web endpoints (prevent .env leaks)
- support showing special identifiers from special forms
- fix conflict between import map and extensions (or approach differently)

## Parsing

- support non-list parsing, multiple statement parsing
- support `\n` as whitespace
- support streaming, non-ASCII encodings

## Environment

- provide full access to env API
- add `restart`
- add ability to access/modify core code
- implement Gödel numbering with hash functions
- consider dynamic scoping vs environment passing

## Evaluation

- rewrite the evaluator as a generic pattern-matcher
- support lazy evaluation
- add support for importing js/ts Procedures
- add support for embedded js/ts
- provide general approach to exposing/accessing js/ts libraries
- achieve metacircular status
- implement JIT compilation / transpile to js

## FileSystem

- implement namespace transformations, deletion, etc.
- implement `save` command

## New features

- add CLI
- garbage collection
- memoization for dynamic programming by default
- implement language server functionality
- integrate git
