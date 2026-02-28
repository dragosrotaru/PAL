# AGENTS.md — hyper-ts

> AI-audience orientation guide for the `hyper-ts` TypeScript library.
> @author claude

## What this is

The core TypeScript library for a **P2P encrypted hypergraph database**.
Provides `HyperGraph`, `HyperNode`, `HyperEdge`, an encrypted `Agent` identity model,
and a `Client` session lifecycle. Data is content-addressed (UUID + Buffer).

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
```

## Encryption model

- **Agent identity**: RSA-4096 keypair. Agent data encrypted with AES-256 symmetric key.
  Symmetric key encrypted with the agent's public key → stored as `EncryptedSymmetricKey`.
- **Storage**: graph repo and name repo are encrypted with the agent's `SymmetricKey`
  at `closeSession` and decrypted at `openSession`.

## Entry points

| Task             | File                                                                              |
| ---------------- | --------------------------------------------------------------------------------- |
| Smoke test       | `src/index.ts` (demo: create agent, persist/retrieve/name/search/delete)          |

## Known stubs / missing pieces

- **Network**: `Client.connect()` and `Client.disconnect()` are no-ops. P2P replication is not implemented.
- **HyperGraph.traverse()**: calls `console.log(this.net)` — no traversal logic.
- Several dependency modules were never implemented: `password`, `hash-id`, `symmetric-key`,
  `object-type-guard`. Build will fail until these are added or replaced.

## Build

```bash
pnpm run build   # tsgo
pnpm run typecheck
```

> Note: Build currently fails due to missing internal module implementations.
