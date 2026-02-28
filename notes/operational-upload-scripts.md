---
date: 2024-01-21
tags: [hyper-ts, operational, scripts, fuse, upload, scratch]
summary: Six operational script specs for HyperFS — bulk upload to content-addressable stores, remote health checks, edge/tag management, watchdog auto-upload, FUSE namespace sync, and garbage collection. Set aside for later.
---

# Operational upload scripts (HyperFS)

## Script 1 — Bulk file upload

- Copy files matching a filepath pattern to local file store using hash as key
- Append hashes to "unorganized", fileType, and any user-provided tags
- Report existing nodes/edges (collisions), offer cancel or skip
- Option: use filename as namespace, or ignore filenames (with collision indication)
- Option: encrypt before pushing to remotes
- Push nodes and edges to remotes with timestamp metadata:
  1. FileCoin
  2. Amazon S3 Bucket (2 regions)
  3. Own server
  4. Own IPFS node
- Produce batch-job object (upload outcomes, time stats, hashes, URLs)
- Push batch-job and new namespace to remotes
- Email namespace details

## Script 2 — Remote health check

- Periodically checks health of remotes and notifies on issues

## Script 3 — Edge/tag management

- Add a node to an edge by hash or name
- Add all nodes in an edge to another edge
- Selectively add nodes from an edge to another edge

## Script 4 — Watchdog auto-upload

- Watch two drop directories (encrypted, unencrypted)
- Auto-upload to file stores on write, then delete local copy
- Tag as "unorganized"

## Script 5 — FUSE namespace sync

- Instantiate or load a namespace in a root folder after selecting a filesystem projection
- Auto-sync changes to file stores on every edit
- Allow naming the current filesystem state (create branch or commit to existing)
- Mirror to GitHub

## Script 6 — Garbage collection

- Garbage collect unnamed nodes/edges

## Beyond (future)

- Share nodes/edges
- Co-edit a node/edge or namespace
- Trigger remote rebuilds by updating a name (requires subscriptions)
- Break out of file paradigm entirely
