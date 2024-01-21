names

atoms

normalization
schema sharing

ownership
access control

Namespace - Abstraction: Tree of Atoms

DHT - Abstraction: List of Atoms
Type System - Abstraction: Atom as Kind

Tree
Graph
Map
Set
Ordered List
Queue
Stack
Array
Linked List
Edge
Node

List
    id: Hash
    length: Number
    list: Hash[]
    kind: Hash

Atom
    id: Hash
    length: Number
    content: Binary
    kind: Hash

Atom
    id: "My Favourite Animal"
    length: 64
    content: "Chickens"
    kind: ASCII

Atom
    id: HASH
    length: ??
    content: "My Favourite Animal"
    kind: ASCII

Edge
    id: HASH
    length: 2
    content: [Hash, Hash]
    kind: Dictionary

parser(Data):Structure
resolver(ID):Data

Data
Claims:
    Length          Resolver
    Parity          Validator
    Hash            Validator
    Order
        Timestamp   Authenticator
        Increment   Authenticator
        Chain       Validator
    Name            Authenticator
    Signature       Validator
    Kind            Parser
    Truth           Authenticator