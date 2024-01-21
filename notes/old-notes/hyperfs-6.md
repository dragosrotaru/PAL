# HyperFS 6

## TODO

- replace Repository Array returns with Iterators
- implement HyperGraph Method Options
- implement HyperGraph Preferences
- implement Agent Preferences
- implement NameSpaces
- implement HyperFS VSCode FileSystem
- implement Language Server Environment
- implement Repositories using Redis, Disk and LocalStorage

## Later

- implement Network
- implement get all IDs by Device
- implement encryption for Repositories
- implement HyperEdge indexing, Traversal/Advanced Querying,look into TinkerPop

## Encodings

- Do I want to make the claim that HelloWorld Is Valid ASCII in JavaScript, or universally?
- How do I create a universal "ASCII" entity? There should be a HyperEdge encompassing the ASCII "topic".
- There could be an algorithm to prefer strongly connected information. Maybe based on shortest path?
- What about inference?
- Edges which use Prefix Notation, Directedness, Encoding, Is and Semantic Triples will generate new Edges ad infinitum. At some point I have to hard-code the semantics in the context

## Network Protocol Behaviours

- incentives, reputation and other adaptive mechanisms
- meeting/work spaces as user interfaces "web-sites"
- physical locations
- payment transactions
- voting
- an agent can broadcast or send data to agents, and request that their data be relayed and to whom
- super nodes / proxies
- reputation could be awarded for content as well
- regulate the topology of the network
- reputation can be shared through vouching
- reputation could be a currency that needs to be spent to minimize leeching
- reputation controlled topology
- nodes could be free to implement their own routing strategies to optimize their reputation
- the network could have its own reputation reserve
- network-wide analytics
- anonymity
- proxy nodes for user interfacing
-

## PetNames

- an agent can search petnames to discover data, devices and agents
- an agent can add petnames to data, devices and agents
- an agent can choose if their petnames are searchable and for whom
- an agent can sign petnames

## Peers

- an agent can discover other agents
- an agent can choose if they are discoverable and by whom
- an agent can send a request to another agent to become their peer
- an agent can receive a request from another agent to become their become peer

### Devices

- an agent can discover devices
- an agent can choose which devices thet would like to make discoverable and by whom

## Data

- an agent can discover data
- an agent can choose if their data is discoverable and by whom
- an agent can send a request to another agent to store their data
- an agent can send a request to another agent to delete their data
- an agent can add a digital signature to their data
- an agent can choose automated policies to control the storage of their data on their devices and other devices

## Resiliance

- the protocol works on the browser
- the protocol works with NAT (udp hole punching, stun, turn)
- there is a simulator to test the network protocol
- the cryptography system can be upgraded in the future

