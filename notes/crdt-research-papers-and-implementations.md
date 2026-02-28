---
date: 2024-01-21
tags: [research, crdt, collaborative-editing, distributed-systems, p2p, replication]
summary: Curated bibliography of CRDT (Conflict-free Replicated Data Types) research papers and open-source implementations. Covers string-wise CRDTs, causal trees, delta-based CRDTs, operation-based types, and real-time collaborative editing. Key implementations include Automerge, Yjs, OrbitDB, Hypercore, and Ink & Switch projects. Important because Pal's collaborative editing and P2P data sync requirements likely need a CRDT layer.
---

# CRDT research: papers and implementations

## Papers

1. A string-wise CRDT algorithm for smart and large-scale collaborative editing systems
2. Causal trees: towards real-time read-write hypertext
3. CRDTs: Making CRDTs Delta-Based
4. Bouillon: a wiki-wiki social web
5. Evaluating CRDTs for Real-time Document Editing
6. A commutative replicated data type for cooperative editing
7. Secure Conflict-free Replicated Data Types
8. A comprehensive study of Convergent and Commutative Replicated Data Types
9. Abstract unordered and ordered trees CRDT
10. A novel CRDT-based synchronization method for real-time collaborative CAD systems
11. PaPoC '21: Proceedings of the 8th Workshop on Principles and Practice of Consistency for Distributed Data
12. Consistency, Availability, and Convergence — Mahajan et al.
13. Pure Operation-Based Replicated Data Types — Carlos Baquero et al. (2017)

## Implementations and projects

- [josephg](https://github.com/josephg) — diamond-types and related CRDT work
- [DerbyJS](https://derbyjs.com) — realtime collaborative framework
- [Automerge](https://github.com/automerge/automerge) — JSON CRDT
- [Hypermerge](https://github.com/automerge/hypermerge) — Automerge over Hypercore
- [Yjs](https://github.com/yjs/yjs) — modular CRDT framework
- [OrbitDB](https://github.com/orbitdb/orbit-db) — P2P database using CRDTs
- [Hypercore Protocol](https://github.com/hypercore-protocol/hypercore)
- [Ink & Switch](https://www.inkandswitch.com/) — research lab behind Automerge
- [Ink & Switch farm](https://github.com/inkandswitch/farm)
- [vscode-hypermerge](https://github.com/inkandswitch/vscode-hypermerge/)
- [Gun](https://github.com/amark/gun) — graph DB with CRDT sync
- [kappa-core](https://github.com/kappa-db/kappa-core/blob/master/intro.md)
- [Swarm](https://github.com/gritzko/swarm)
- [Braid](https://braid.org/) — HTTP extensions for sync
- [IPFS CRDT notes](https://github.com/ipfs/notes/tree/master/CRDT)
- [crdt.tech](https://crdt.tech)
- [replicated.cc](https://replicated.cc/)

## Reading

- https://josephg.com/blog/crdts-are-the-future/
- http://archagon.net/blog/2018/03/24/data-laced-with-history/
- http://bloom-lang.net/
- http://jtfmumm.com/blog/2015/11/17/crdt-primer-1-defanging-order-theory/
- https://www.wikiwand.com/en/Order_theory
- https://www.wikiwand.com/en/Lattice_(order)
- http://brewster.kahle.org/2015/08/11/locking-the-web-open-a-call-for-a-distributed-web-2/
- https://docs.datproject.org/
- https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type

## HN threads

- https://news.ycombinator.com/item?id=23737639
- https://news.ycombinator.com/item?id=23802208
- https://news.ycombinator.com/item?id=22039950
- https://news.ycombinator.com/item?id=19886883
