---
date: 2024-01-21
tags: [research, fuse, filesystem, rust, p2p, ipfs, hypercore]
summary: Short reference list of FUSE filesystem implementations relevant to pal-fs and hyper-fs. Covers the Rust fuser crate, a Rust filesystem example (gotenksfs), a Google Cloud Storage FUSE driver (gcsf), and P2P filesystem implementations over Hypercore and IPFS. Important as prior art for pal-fs (which uses fuser) and hyper-fs.
---

# FUSE filesystem implementation references

- [fuser](https://lib.rs/crates/fuser) — Rust FUSE crate (used by pal-fs)
- [gotenksfs](https://github.com/carlosgaldino/gotenksfs) — Rust filesystem implementation example
- [gcsf](https://github.com/harababurel/gcsf) — Google Cloud Storage as FUSE filesystem (Rust)
- [hyperfs](https://github.com/mafintosh/hyperfs) — FUSE filesystem over Hypercore
- [ipfs-fuse](https://github.com/tableflip/ipfs-fuse) — FUSE filesystem over IPFS
