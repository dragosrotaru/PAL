---
date: 2024-01-21
tags: [fuse, filesystem, database, storage, hyper-ts]
summary: The Linux storage stack has too many layers, databases bypass the filesystem API, and data ends up controlled by systems rather than users. HyperFSDB proposes collapsing this by running a FUSE filesystem that is simultaneously a database — single userland process exposing FUSE, embedded API, network endpoint, CLI, and web client.
---

# FUSE as unified storage layer

## The problem with the current storage stack

The Linux storage stack: userland app → IPC → database → VFS syscalls → filesystem ABI (ext4/xfs) → Device Mapper/LVM → Block Layer → Physical Devices. Plus the network layer on top (HTTP caching, distributed DB sharding, application caching).

Issues:

- **Databases are a form of nexus rejection** — they overlay the filesystem to add functionality without adhering to the filesystem API. Interacting with files owned by a running database directly is not allowed.
- **Durability (D in ACID) is not achieved in practice** — the number of layers creates too many failure points.
- **Performance tradeoffs are constrained** by the depth of the stack.
- **The stack is not user-centric** — data is controlled by the system, not the user.

## HyperFSDB

Runs in userland. Provides four interfaces to the same underlying data:

- **FUSE filesystem API** — any app that reads/writes files works transparently
- **Application-embedded API** — direct in-process access
- **Network endpoint API** — remote access
- **Web client + CLI** — human interfaces

All interfaces write to the same store. The user's data lives on the user's machine.

## Reference

- [The Linux Storage Stack Diagram](https://upload.wikimedia.org/wikipedia/commons/f/fb/The_Linux_Storage_Stack_Diagram.svg)
- [Database as Filesystem (MySQLFS)](https://www.youtube.com/watch?v=wN6IwNriwHc)
