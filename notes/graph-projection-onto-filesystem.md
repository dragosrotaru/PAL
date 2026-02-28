---
date: 2024-01-21
tags: [filesystem, graph, dependency-graph, fuse, hyper-ts]
summary: Hierarchical filesystems force an artificial tree onto what is really a dependency graph — a file can have multiple dependents in different subtrees, which breaks any single organizing principle. The solution is to store the actual graph and project it onto the filesystem view, using FUSE to make the projection transparent. This is the core intellectual motivation for hyper-ts.
---

# Graph projection onto the filesystem

## The problem with hierarchical filesystems

Structuring software projects is difficult because there is no correct solution. By the very nature of hierarchical filesystems, engineers must compromise and select a limited set of organizing principles. Every such set has pros and cons.

Consider the organizing principle: place every File X in a Folder X, and every dependency of File X as a subdirectory.

```
/Dir-A/
  File-A
  Dir-B/
    File-B
    Dir-C/
      File-C
  Dir-D/
    File-D
```

For the graph `A→B→C, A→D` this works cleanly: every import is `./Dir-X/File-X`, and all direct dependencies are visible in immediate subdirectories.

## Where it breaks

Add one edge: `A→C` (A now depends directly on C as well as via B).

A standard Unix filesystem has no clean solution:

1. **Copy** `/Dir-A/Dir-B/Dir-C/File-C` to `/Dir-A/Dir-C` — violates DRY, complexity grows exponentially
2. **Soft link** — appears zero-cost but breaks traversal guarantees and creates hidden indirection
3. **Import the deep path** `import C from "./B/C"` — compromises the universality of the organizing principle
4. **Relative parent import** `import C from "../../C"` — same compromise, harder to read

None of these are satisfying. The root cause is that a graph is being forced into a tree.

## The solution

Let the graph be the source of truth. Every file is a node; every dependency is a directed edge. The filesystem view is a **projection** of this graph — computed, not stored. FUSE makes this transparent to any application that expects a normal filesystem.

This eliminates the impedance mismatch: the graph is stored as a graph, and the filesystem is a derived view over it. Multiple valid projections can coexist (by-dependency, by-type, by-modification-date) without touching the underlying data.
