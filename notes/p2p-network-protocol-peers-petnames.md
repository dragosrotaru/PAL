---
date: 2024-01-21
tags: [p2p, network, protocol, reputation, petnames, peers, hyper-ts]
summary: P2P protocol design for HyperFS — agent discovery, petname-based addressing, reputation as a routing/access-control primitive, and data sovereignty policies. Interesting because reputation is treated as a spendable currency that regulates network topology, not just a badge.
---

# P2P network protocol — peers, petnames, reputation

## PetNames

- An agent can search petnames to discover data, devices, and agents
- An agent can add petnames to data, devices, and agents
- An agent can choose if their petnames are searchable and for whom
- An agent can sign petnames

## Peers and devices

- An agent can discover other agents; can choose if they are discoverable and by whom
- An agent can send/receive peer requests
- An agent can discover devices; can choose which devices are discoverable and by whom

## Data sovereignty

- An agent can discover data; can choose if their data is discoverable and by whom
- An agent can request another agent store or delete their data
- An agent can add a digital signature to their data
- An agent can set automated policies to control storage across devices

## Network protocol behaviours

- Incentives, reputation, and adaptive mechanisms
- Meeting/work spaces as user interfaces ("web-sites")
- Physical locations, payment transactions, voting
- An agent can broadcast or send data to agents, and request relay
- Super nodes / proxies
- Reputation awarded for content as well as routing
- Reputation shared through vouching
- **Reputation as spendable currency** — must be spent to minimize leeching
- Reputation-controlled topology — nodes implement own routing strategies to optimize reputation
- Network-wide analytics
- Anonymity, proxy nodes for user interfacing

## Resilience requirements

- Protocol works in the browser
- Protocol works with NAT (UDP hole punching, STUN, TURN)
- Simulator to test the network protocol
- Cryptography system upgradeable in the future

## Implementation todos (planned)

- implement Network
- implement get all IDs by Device
- implement encryption for Repositories
- implement HyperEdge indexing, traversal, advanced querying (look into TinkerPop)
