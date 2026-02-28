---
date: 2024-01-21
tags: [atom, component, iframe, hash, namespace, wild-cards, content-addressing]
summary: A browser-based component model where every component ("Atom") is hash-addressed, iframe-isolated, and communicates via postMessage. Components have a global namespace (wild.cards subdomains), versioned by hash, and compose via URL references, import statements, and events. Comparable to ObservableHQ cells but with content-addressing and P2P distribution.
---

# Hash-addressed Atom component model

## Virtual filesystem / module resolver

The environment needs a virtual filesystem / module resolver that serves:
- The language server (for VSCode or a Notion-like editor)
- The standalone compiler
- The bundler

The magic bits:
- Live loading code
- Editing the AST

Creating a component that edits the AST is almost impossible.

**A new strategy: create a TS REPL environment** where you can interact with your data models. The code editing is still useful. All data code should be serializable. There is one bit that still needs a solution: JSON symbols (pointers/references).

## Core concept

Every component ("Atom") is:
- Identified by a hash of its source code — every version has a unique hash name
- Isolated in its own iframe on a unique origin (`https://<hash>.reference.design/index.html`)
- Versioned — can be named within a namespace, but the hash is the stable identity; name may be enforced once you save once
- Composable — Atoms compose via iframe URL references, import statements, postMessage events, and API calls

## Global namespace

```
wild.cards               ← root
vivcrowe.wild.cards      ← user subdomain
```

Every person and group has a unique subdomain. Every subdomain has its own namespace. Internal namespace nodes are collections that act as message buses or Page UIs. Collections render flattened when nested by default.

## Atom interfaces

An Atom may implement:
- **cell** — can send and receive messages via postMessage/API
- **stateful** — serializable/deserializable to JSON for persistence
- **renderable** — can display in an iframe

Atoms also have possible views: a terminal, an editor, and/or a custom rendered HTML UI. Every Atom may have methods accessible from the terminal.

Atoms can depend on other Atoms, import external code from npm/URLs. They can be given a name within a namespace — name enforcement may kick in once you save for the first time.

## Atom metadata

Saved with each Atom:
- Interfaces implemented (postMessage/API event/command/query types)
- Static imports (internal and external)
- Content Security Policy
- Permissions policy
- Hash versioning and tagging
- Publish/sharing policy

## Composition patterns

- `iframe url reference` — embed another Atom's rendered output
- `import statements` — use another Atom's exported value
- `postMessage events` — communicate across origin boundaries
- `api calls` — request/response between Atoms

## Rendering

- Atoms can register to send events to specific targets only
- Atoms can render other Atoms via iframes
- Atoms can render a completely different website if registered
- A marketplace with code reviews exists for using Atoms

## Implementation backlog

- Write typeguard
- Add localhost storage
- Guarantee model has checked errors before running or saving
- Run the code in an iframe or webworker
- Add module resolution
- Enforce one export per "file"
- Add key to save and to run
- Add linting on save
- Execute code in sandbox and postMessage (data types will be restricted to structured-clone-compatible)
- Return React Components

## Compiler Code vs Data Code bridge

A recurring design problem: Data Code (types, schemas defined in code) needs to be available to the runtime, but runtime-compiled code and statically-typed code live in different evaluation contexts.

Two options:
1. **Dev-server/Electron approach** — make data code available to the runtime through a live reload server
2. **Virtual data code** — store data code on a backend; all code that shares types with data code is treated as "virtual" (resolved at load time)
