# Pal

## What is Pal

Pal is a personal AI programming environment. It is a re-imagination of what is possible in the realm of programming and personal computing. Pal started out as a research project in 2019 called changetheweb.xyz - an attempt to redesign the web from scratch knowing what we know today. I spent years exploring the history of computing and state of the art research across a wide range of domains. Over time, I built over a dozen prototypes to explore various crevices of software and layers of abstraction. You can see what I mean in the notes.

In its current state, it is more a vehicle for learning than a useable tool. The most complete version is pal-ts, Which is essentially a lisp interpreter with some very unique features, including a built in LLM, filesystem-mapped environment and file extensions as Types. The current version is in Rust. Otherwise, there are bits and pieces of projects here and there which I have attempted to converge into a cohesive vision.

## Hyper

- CRDT based
- content addressed
- pet-named
- p2p
- encrypted
- hypergraph database/protocol

## Pal

- Extensible Lisp like Interpreter 
- UI auto gen from data
- File System synced to intepreter environment
- AI as first class form in language
- constrained decoding
- file extensions as type system

## Repo Structure

- `pal-ts` - TS core pal implementation
- `pal-fs-vscode` - TS vscode extension for a virtual filesystem
- `pal-lsp-example` - TS vscode extension but just for pretty format
- `pal-eval` - Rust pal implementation for ts to rust testing 
- `pal-lsp` - Rust language server protocol + pal implementation
    - `pal-lsp/client` - TS lsp client for the Rust LSP above
- `pal-fs` - Rust fuse virtual FS stub for pal
- `pal-rs` - Rust pretty format specific macro compilation
- `hyper-ts` - protocol implementation
- `hyper-fs` - fuse virtual filesystem adapter 
- `pal-os` - what if it was an operating system?
- `wingman` - what if it was a webgpu IDE / runtime written in Rust?
