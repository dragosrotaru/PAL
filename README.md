# Pal

## What is Pal

Pal is a personal AI programming environment. It is a re-imagination of what is possible in the realm of programming and personal computing. Pal started out as a research project in 2019 called changetheweb.xyz - an attempt to redesign the web from scratch knowing what we know today. I spent years exploring the history of computing and state of the art research across a wide range of domains. Over time, I built over a dozen prototypes to explore various crevices of software and layers of abstraction. You can see what I mean in the notes.

In its current state, it is more a vehicle for learning than a useable tool. The most complete version is pal-ts, Which is essentially a lisp interpreter with some very unique features, including a built in LLM, filesystem-mapped environment and file extensions as Types. The current version is in Rust. Otherwise, there are bits and pieces of projects here and there which I have attempted to converge into a cohesive vision.

## Project Structure

- `wingman` - integrated development environment / runtime in Rust
- `pal-rs` - current implementation of Pal language in Rust
- `pal-fs` - FUSE filesystem integration in Rust
- `pal-ts` - older experimental implementation of Pal in TypeScript
- `pal-vscode` - VSCode extension for Pal
- `pal-os` - Starting point for creating a linux distro
- `rabbithole` - firefox/chrome web extension
- `hyper` - older experiments in TypeScript