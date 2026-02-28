# AGENTS.md — hyper

> AI-audience orientation guide for the `hyper` sub-project family.
> @author claude

## What this is

A collection of sub-projects building toward a **P2P encrypted hypergraph database**
accessible via a FUSE filesystem. Conceptually: a content-addressed, peer-to-peer
knowledge store where any data (nodes) and any relationship (edges) can be persisted,
named, retrieved, and searched.

## Sub-projects

| Directory | Language | Purpose |
|-----------|----------|---------|
| `hyper-ts/` | TypeScript | Core library: `HyperGraph`, `HyperNode`, `HyperEdge`, `Client`, crypto |
| `hyper-fs/` | TypeScript | FUSE filesystem that exposes a `Device`'s encrypted HyperGraph as a mountable directory |
| `hyper-server/` | TypeScript | Express + WebSocket + Y-WebSocket server for Yjs CRDT collaboration |
| `hyper-web/` | React/TypeScript | Browser SPA: editor, CRDT editor, tasks, RAM view, wildcards, terminal |
| `livecoding/` | JavaScript | Minimal live-coding server/client (file watcher + hot-reload via WebSocket) |

## Architecture

```
hyper-ts (data layer)
  ├── HyperNode          — content-addressed data blob (Buffer, UUID)
  ├── HyperEdge          — typed relationship between nodes (Buffer, UUID)
  ├── HyperGraph         — local persist/retrieve/delete/name/search over nodes+edges
  ├── Client             — session lifecycle: login → decrypt → connect → graph
  ├── Agent              — encrypted identity: name, RSA keypair, AES symmetric key
  └── Repositories (interfaces)
        ├── IHyperGraphRepository   — local node/edge storage (one impl: in-memory)
        ├── IPetNameRepository      — name → ID mapping
        └── IAgentRepository        — encrypted agent blobs

hyper-fs (filesystem)
  └── Device (password + config)
        └── FUSE mount at ./mount
              └── FuseHandlers → Device → HyperGraph ops

hyper-server (CRDT sync)
  └── Y-WebSocket → Yjs document sync for hyper-web CRDTEditor

hyper-web (UI)
  └── React Router → Views: CRDTEditor | Tasks | RAM | WildCards | Terminal | Editor
```

## Encryption model

- **Agent identity**: RSA-4096 keypair. Agent data encrypted with AES-256 symmetric key.
  Symmetric key encrypted with the agent's public key → stored as `EncryptedSymmetricKey`.
- **Storage**: graph repo and name repo are encrypted with the agent's `SymmetricKey`
  at `closeSession` and decrypted at `openSession`.

## Entry points

| Task | File |
|------|------|
| Smoke-test hyper-ts | `hyper-ts/src/index.ts` (demo: create agent, persist/retrieve/name/search/delete) |
| Mount FUSE filesystem | `hyper-fs/src/index.ts` (args: password, config-file) |
| Start CRDT server | `hyper-server/src/index.ts` (port 7777) |
| Run web UI | `hyper-web/src/index.tsx` (CRA dev server) |

## Known stubs / missing pieces

- **Network**: `Client.connect()` and `Client.disconnect()` are no-ops (pass with ~99.9% prob).
  P2P replication is not implemented.
- **HyperGraph.traverse()**: calls `console.log(this.net)` — no traversal logic.
- **hyper-web**: `RAM`, `Tasks`, `WildCards`, `Terminal` views — unclear implementation state.
- **livecoding**: standalone experiment with no connection to hyper-ts or the Pal runtime.

## Build

```bash
# hyper-ts
cd hyper/hyper-ts && npm install && npx tsc

# hyper-fs
cd hyper/hyper-fs && npm install && npx tsc
node dist/index.js <password> <config.json>

# hyper-server
cd hyper/hyper-server && npm install && npx tsc && node dist/index.js

# hyper-web
cd hyper/hyper-web && npm install && npm start
```
