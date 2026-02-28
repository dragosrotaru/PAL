---
date: 2024-01-21
tags: [wingman, crdt, ast, representation, transformers, llm, graph, views, version-control]
summary: Design for representing source code as a CRDT-backed binary AST. The AST carries unconventional attachments beyond the code itself: test cases, memoized results, debugging data, performance statistics, documentation, examples, conversations, previous versions, and other language implementations — all attached directly to AST nodes. Views are projections of the graph (dependency view, types view, tests view, docs view). LLM/Transformer integration: compress the AST into a context window for predefined tasks, output is a modification of the AST. Known downsides: version control (incompatible with git workflows) and deployment (would require an "eject to Rust" escape hatch). CRDT references: Automerge, crdt_tree, mutable tree hierarchy (madebyevan), Kleppmann move-op, VUB 2022. Important as the core data model for the Wingman editor and the bridge between code, AI, and CRDT replication.
---

# Wingman: CRDT-AST representation and transformer integration

## Core model

Source code is represented as an **abstract syntax tree stored in binary format**. This AST is also a **CRDT**.

### Pipeline functions

```
current_state : CRDT → AST       (time-domain → state-domain)
macro         : AST → Rust        (state-domain → pre-compiled Rust)
eval_expr     : AST → AST         (state-domain → evaluated)
```

## Unconventional AST attachments

Beyond the code itself, every AST node carries:

- Test cases
- Memoized results
- Debugging data
- Performance / statistics
- Documentation
- Examples
- Conversations
- Previous versions
- Other language implementations

**All of these aspects of the code are attached to the AST.**

## Views as graph projections

Views are read-only projections of the underlying graph:

- Dependency view
- Types view
- Tests view
- Documentation view
- (extensible)

## Transformer / LLM integration

For integrating LLMs into the tooling: compress the AST into a context window for any number of predefined tasks, each with a specific prompt. The output of the model is a modification of the AST.

## Known downsides

1. **Version control** — incompatible with git workflows; teams used to CI/CD will find this disorienting
2. **Deployment** — requires an export/eject capability (e.g., eject to Rust — possibly ugly output)

These are out of scope for the initial version. The most important escape hatch is export.

## CRDT references

- [Automerge](https://automerge.org/)
- [crdt_tree (maidsafe)](https://github.com/maidsafe/crdt_tree)
- [CRDT mutable tree hierarchy (madebyevan)](https://madebyevan.com/algos/crdt-mutable-tree-hierarchy/)
- [Kleppmann move-op paper](https://martin.kleppmann.com/papers/move-op.pdf)
- [VUB TR-SOFT-22-17 (2022)](https://soft.vub.ac.be/Publications/2022/vub-tr-soft-22-17.pdf)
