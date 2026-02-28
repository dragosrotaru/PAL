---
date: 2024-01-21
tags: [versioning, crdt, persistence, hyper-ts, filesystem]
summary: File versioning model with configurable granularity and change-group commit semantics before propagation to peers.
---

# File versioning model

Every file has its own version history. Versioning granularity is configurable:

- **Per keyboard event** — for collaborative editors
- **Per save** — default
- **Per commit** — explicit checkpoint

## Change groups

Files can be marked as belonging to a **change group**. Any modification to a file
in the group must be committed before propagating to other nodes. Files outside a
change group propagate changes immediately.

This gives git-like commit semantics at the file level, opt-in per file or folder.

## Storage

- Storage medium varies: local drives, cloud, IPFS
- Versioning format varies: delta, state, ops
- Files are content-addressable — resolvable by name or hash
- File versions can be tagged
- Namespace duplicates can be listed
- Files browsable by title, last modified, format

## Inheritance

Persistence settings are inherited from parent folders and behave as a union of sets.
