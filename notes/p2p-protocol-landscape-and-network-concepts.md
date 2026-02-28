---
date: 2024-01-21
tags: [research, p2p, distributed-systems, dht, gnunet, freenet, blockchain, mesh-network]
summary: Survey of P2P protocols and network concepts relevant to Pal's data layer. Covers blockchain/DAG protocols (Ethereum, Holochain, IOTA, Cosmos, Hashgraph), social/identity protocols (Scuttlebutt, Urbit, Ceptr, MetaCurrency), data protocols (DAT/Hypercore, IPFS/libp2p), and privacy networks (Tor, I2P, Freenet, ZeroNet). In-depth notes on GNUNet (local trust, symmetric encryption keyed from content hash, triple-hash anonymity protocol, TTL, block/iblock structure) and Gnutella (tiger hashing, binary Merkle tree). Key concepts: small-world networks, DHT, key-based routing, hidden services, mesh networks.
---

# P2P protocol landscape and network concepts

## Protocol survey

### Blockchain / DAG

- [Ethereum](https://ethereum.org)
- [IOTA](https://www.iota.org)
- [Radix](https://www.radixdlt.com)
- [Cosmos](https://cosmos.network)
- [Hedera Hashgraph](https://www.hedera.com)
- [Obyte (Byteball)](https://obyte.org)

### Social / identity / alternative economies

- [Scuttlebutt](https://scuttlebutt.nz)
- [Urbit](https://urbit.org)
- [Holochain](https://holochain.org)
- [Ceptr](http://ceptr.org)
- [MetaCurrency](http://metacurrency.org)
- [Economic Space Agency](https://economicspace.agency)
- [Althea](https://althea.net) — mesh network incentives

### Data protocols

- [DAT / Hypercore Foundation](https://dat.foundation)
- IPFS / libp2p

## Core network concepts

- Small world network
- Key-based routing
- Distributed Hash Table (DHT)
- Darknet / hidden services
- Mesh network
- Friend-to-Friend (F2F)

## Protocol deep dives

### Gnutella

- Uses Tiger Hashing — binary Merkle tree, block size 1024 bytes

### GNUNet

- Local trust system
- F2F (Friend-to-Friend) mode possible
- **DBlocks** (Nodes) and **IBlocks** (Edges) — mirrors HyperGraph Node/Edge structure
- Blocks are encrypted with a symmetric key derived from their hash
- **GNUNet Anonymity Protocol**: triple hash `H(H(H(Data)))` — responder sends back `H(H(Data))` confirming data is correct for intermediate nodes without leaking the data
- TTL prevents lingering queries
- Priority indicates how much trust the requester wants to spend
- Intermediate nodes can choose to rewrite reply addresses (provides cover traffic at bandwidth cost) or leave as-is (avoids being a link on the path back to the origin)
- URI format: `gnunet://fs/chk/[file hash].[query hash].[file size in bytes]` — query hash is the hash of the topmost block

### Freenet (research more)

- Dark mode (F2F) vs open mode (P2P)
- Data is inserted into the network and distributed; data is forgotten over time if not accessed
- Nodes may choose to cache data they're sending back to requesters

### Other networks (to research)

Git · Tor · I2P · AnoNet · Riffle · ZeroNet · BitTorrent · WebTorrent
