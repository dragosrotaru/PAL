---
date: 2024-01-21
tags: [hypergraph, data-model, encoding, identity, set-theory, semantic-triples, canonical-form, changetheweb]
summary: Formal treatment of the HyperGraph data model. Binary encoding of Node and Edge with multihash IDs. The `is` identity function and why it requires traversal. Why pure set-theoretic edge definitions are counterproductive (Incompleteness Theorem). Semantic triples as more fundamental than sets. Notes on canonical form via Lambda Cube / CoC. Open questions about infinity, streams, and null.
---

# HyperGraph formal data model

## Binary encoding

### Node

- `d` — finite sequence of arbitrary binary information
- `l` — byte length of `d`, encoded in LEB128 (or similar variable-length unsigned int)
- `t` — byte code representing the type `Node`
- `h` — multihash of `d`
- `id` — concatenation of `t h l`

### Edge

- `s` — finite sequence of binary-encoded multihashes
- `l` — byte length of `s`, encoded in LEB128
- `t` — byte code representing the type `Edge`
- `h` — multihash of `s`
- `id` — concatenation of `t h l`

The `id` encodes type, hash, and length — allowing a client to know size and type before receiving full content.

## Identity: the `is` function

Ideally, equality of Nodes/Edges reduces to equality of IDs. Two problems:
1. The hashing function may be replaced over time — we need a fundamental way to compare when that happens
2. Collisions are possible, however improbable

Therefore, to verify `x is y`, x and y must be traversed and information compared with binary equality:

```
is: (x: Edge, y: Node) => False
is: (x: Node, y: Edge) => False
is: (x: Edge, y: Edge) => x.s.length != y.s.length ? False : x.s.every(index => x.s[index] is y.s[index])
is: (x: Node, y: Node) => x.d = y.d
is: (x: ID, y: ID) => traverse(x) is traverse(y)
```

Where `traverse` is a graph traversal method and `=, !=` are binary operators.

`x is y` is symmetric. `is` may never terminate due to circular references, or may take a long time for large graphs. A maximum depth parameter can be used.

### Extensions needed for `is`

- Depth parameter for bounded traversal
- Support for other types: WildCards, infinite sequences/streams, circular references
- A performant `is` that checks hashes only (no traversal)
- Deletion of information
- Expressing errors from traversal: `Either(Error, Information)`
- Memoization of computation
- `is` itself is an Object of some kind — how is it encoded?

### Semantic triples

The function `is`, the function call `A is B`, the function call `B is A`, the result `(A is B)`.

We want a system such that:
- `(is is is)` — the function is the same
- `(A is B is B is A) is true` — the function calls are the same (ideally with the same ID)
- `((A is B) is (B is A)) is True` — the results are the same

We need to define: a Function-like Object, a Result Object, a `True` primitive, a `False` primitive.

## Ordered vs set-theoretic edges

The encoding above maps naturally to a sequence (ordered n-tuple):
- `s` can be empty: `()`
- `s` has a total order defined by index: `(a b c) ≠ (b a c)`
- `s` can have duplicates: `(a a b c a)`

We could instead define Edges as Sets by: requiring no duplicate IDs, ignoring index order, using lexicographic order for a consistent ID.

[Kuratowski's definition of an ordered pair](https://en.wikipedia.org/wiki/Ordered_pair): `(a b) = { {a} {a b} }`. This allows encoding tuples purely from sets.

**Conclusion: defining Edges specifically as Sets is counterproductive.** Reasons:
1. **The Incompleteness Theorem** — a pure set-theoretic approach limits us to truths provable only in Set Theory
2. Meaning-making is more fundamental than the Set. Without our facilities for expressing meaning, Set Theory could not be defined. The ability to say "something is something" — a semantic triple — is more fundamental. Start there, not from Set Theory.

## Canonical form

We need to find a canonical form to store meaning in. Reading Lambda Cube, Calculus of Constructions, Intuitionistic Type Theory. While we cannot find a single formal system that is complete and consistent (nor should we want to), we should be able to find a single normal form encoding sufficient to encode the vast majority of meaning and provide interoperability — allowing humans and automata to understand each other better, at least for some finite time.

## Open questions

**The absence of something** — the empty edge is the empty set. What about the empty Node? If a Node is absent of any information, is it `Nothing`? `None`? `null`? `void`?

**Interesting boundary concepts:**
- Infinity
- Truth (True and False primitives)
- Self
- Time
- Random

**Infinite sequences and streams** — a Type could have an infinite boundary (a data stream). How do we encode sequences of indeterminate length?

**Breaking up long sequences** — into multiple Nodes/Edges?

**Timestamps, agents, signing** — nodes/edges?

**Node information self-describing encodings** — multiformats?

**Indexing content** and **computations as objects** — verification of computation.

**LEB128 or an alternative** for variable-length encoding?

## Identity — further reading

- [Identity (Philosophy)](https://en.wikipedia.org/wiki/Identity_(philosophy))
- [Identity of Indiscernibles](https://en.wikipedia.org/wiki/Identity_of_indiscernibles)
- [Identity (Mathematics)](https://en.wikipedia.org/wiki/Identity_(mathematics))
- [Identity Element](https://en.wikipedia.org/wiki/Identity_element)
- [Identity Function](https://en.wikipedia.org/wiki/Identity_function)
- [Logical Equality](https://en.wikipedia.org/wiki/Logical_equality)
