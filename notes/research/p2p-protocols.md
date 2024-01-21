# P2P Protocol Research

## Protocols

- Ethereum - https://ethereum.org
- Holochain - https://holochain.org
- Iota - https://www.iota.org
- Radix - https://www.radixdlt.com
- Cosmos - https://cosmos.network
- HashGraph - https://www.hedera.com
- Byteball - https://obyte.org
- Ceptr - http://ceptr.org
- Althea - https://althea.net
- Urbit - https://urbit.org
- Scuttlebutt - https://scuttlebutt.nz
- Economic Space Agency - https://economicspace.agency
- DAT - https://dat.foundation
- MetaCurrency - http://metacurrency.org

## Concepts

- small world network
- key based routing
- darknet
- distributed hash table
- hidden services
- mesh network

## Gnutella

- uses tiger hashing - binary merkle tree, block size 1024 bytes

### GNUNet

- local trust system
- F2F - Friend to Friend possible
- GNUNet has DBlocks (Nodes) and IBlocks (Edges)
- Blocks are encrypted with a symmetric Key derived from their Hash
- GNUnet Anonymity Protocol works with triple hash H(H(H(Data))) so responder sends back H(H(Data)) confirming the data is correct for intermediate nodes without leaking the data
- TTL prevents lingering queries
- Priority indicates how much of their trust they want to spend on the request
- Intermediate Nodes canc choose to rewrite reply address or leave it as is. If leaving as is they avoid being a link for path back to request origin. rewriting provides them with cover traffic to hide their own actions, while also costing them bandwidth
- URI: gnunet://fs/chk/[file hash].[query hash].[file size in bytes] where query hash is the hash of the top-most Block

### Freenet\* (research more)

- Dark mode and open mode = F2F vs P2P
- Data is inserted into network and distributed, data is forgotten over time if not accessed
- Nodes may choose to cache data it is sending back to requester

### Git

### Tor

### I2P

### IPFS / Libp2p

### AnoNet

### Riffle

### ZeroNet

### BitTorrent

### WebTorrent
