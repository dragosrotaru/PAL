# AGENTS.md — hyper

> AI-audience orientation guide for the `hyper` sub-project family.
> @author claude

## What this is

A collection of sub-projects building toward a **P2P encrypted hypergraph database**
accessible via a FUSE filesystem. Conceptually: a content-addressed, peer-to-peer
knowledge store where any data (nodes) and any relationship (edges) can be persisted,
named, retrieved, and searched.

## Sub-projects

| Directory       | Language         | Purpose                                                                                 |
| --------------- | ---------------- | --------------------------------------------------------------------------------------- |
| `hyper-ts/`     | TypeScript       | Core library: `HyperGraph`, `HyperNode`, `HyperEdge`, `Client`, crypto                  |
| `hyper-fs/`     | TypeScript       | FUSE filesystem that exposes a `Device`'s encrypted HyperGraph as a mountable directory |    |

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
```

## Encryption model

- **Agent identity**: RSA-4096 keypair. Agent data encrypted with AES-256 symmetric key.
  Symmetric key encrypted with the agent's public key → stored as `EncryptedSymmetricKey`.
- **Storage**: graph repo and name repo are encrypted with the agent's `SymmetricKey`
  at `closeSession` and decrypted at `openSession`.

## Entry points

| Task                  | File                                                                              |
| --------------------- | --------------------------------------------------------------------------------- |
| Smoke-test hyper-ts   | `hyper-ts/src/index.ts` (demo: create agent, persist/retrieve/name/search/delete) |
| Mount FUSE filesystem | `hyper-fs/src/index.ts` (args: password, config-file)                             |
                             |

## Known stubs / missing pieces

- **Network**: `Client.connect()` and `Client.disconnect()` are no-ops (pass with ~99.9% prob).
  P2P replication is not implemented.
- **HyperGraph.traverse()**: calls `console.log(this.net)` — no traversal logic.

## Build

```bash
# hyper-ts
cd hyper-ts && npm install && npx tsc

# hyper-fs
cd hyper-fs && npm install && npx tsc
node dist/index.js <password> <config.json>
