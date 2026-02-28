# AGENTS.md — pal-fs

> AI-audience orientation guide for the `pal-fs` FUSE filesystem crate.
> @author claude

## What this is

A FUSE filesystem that exposes the Pal reactive environment as a virtual filesystem.
Uses the `fuser` crate (Rust FUSE bindings). Currently all filesystem operations are stubs.

## Intent

The goal is: mount the Pal Env as a FUSE filesystem so that any tool that can read/write files can interact with the Pal environment. This is the "filesystem-mapped environment" vision taken to its logical conclusion — instead of watching a real directory with chokidar (pal-ts approach), _be_ the filesystem via FUSE.

## Current State

`PalFS` implements the full `fuser::Filesystem` trait with empty method bodies.
Only `open`, `opendir`, `release`, `releasedir`, and `statfs` return non-empty responses.
Everything else is a no-op.

## Missing Pieces

- All inode operations (lookup, read, write, readdir, getattr) need implementation.
- No backing store — needs integration with Pal Env or a real storage layer.
- `main()` just prints "Hello, world!" — no FUSE mount call.

## Build

```
cargo build -p pal-fs
```

FUSE requires OS-level FUSE support (`libfuse` on Linux/macOS, or `macFUSE`).
