---
date: 2024-01-21
tags: [data-model, hypergraph, atom, edge, hash, type-system, hyper-ts]
summary: The core data primitives for HyperGraph — everything is either an Atom (content-addressed binary blob with a kind) or a List/Edge (ordered list of hashes with a kind). Types are defined as Atoms whose kind is 'Kind'. A two-layer model: a low-level data layer (Node/Edge/Hash) and a semantic layer (Object/Type/Interface/Schema) built on top.
---

# Atom/Edge primitive data model

## Primitives

Everything reduces to two types:

```
Atom
  id: Hash
  length: Number
  content: Binary
  kind: Hash        ← points to a type atom

List
  id: Hash
  length: Number
  list: Hash[]      ← ordered list of references
  kind: Hash
```

Example atoms:
```
Atom { id: HASH, content: "Chickens", kind: ASCII }
Atom { id: HASH, content: "My Favourite Animal", kind: ASCII }
Edge { id: HASH, content: [Hash("My Favourite Animal"), Hash("Chickens")], kind: Dictionary }
```

## Data layer vs semantic layer

**Data layer** — raw storage:
```
Node  { Hash, Content }
Edge  { Hash, HashList }
Symbol { id }
```

**Semantic layer** — built on top:
```
Object    { ID, Name, Type: Type::ID, DefaultInterface: Interface::ID, Data }
Type      { ID, Schema: Schema::ID, DefaultInterface, PreferredInterfaces, Name }
Interface { ID, Name, Schema: Schema::ID, DefaultType, PreferredTypes }
Schema    { Key: Value }
```

## Addressing

- Names (human-readable): `Namespace → List of Atoms`
- DHT: `List of Atoms` (content-addressable, distributed)
- Type System: `Atom as Kind`

## Data claims

Each piece of data can carry validators:
- Length Resolver, Parity Validator, Hash Validator
- Order, Timestamp Authenticator, Increment Authenticator
- Chain Validator, Name Authenticator, Signature Validator
- Kind Parser, Truth Authenticator

## Protocol levels

Two representations for the same data:

**Protocol level** (machine / human / editor):
```
Atom:Type ( Symbol )
Object ( Type  Property )
Task ( Object  Property(title String)  Property(status String) )
Edge:MyTask ( Task  "finish writing the compiler"  "in progress" )
```

**Language level** (compiled, with type-checking via symbol scoping):
```
Task:MyTask {
  name { finish writing the compiler }
  status { in progress }
}
```

## Open questions (from original notes)

- How to create a universal ASCII entity (a HyperEdge encompassing the ASCII topic)?
- Algorithm for preferring strongly connected information (shortest path)?
- Edges using Prefix Notation + Directedness + Encoding + Semantic Triples generate new edges ad infinitum — at some point semantics must be hard-coded in context
