---
date: 2024-01-21
tags: [web-vision, naming, petnames, url, content-addressing, zooko, resolution, changetheweb]
summary: URLs identify by location, not by content — a fundamental flaw. Content addressing (IPFS-style hashing) solves reference identity. Zooko's triangle says you can only have 2 of 3: human-meaningful, secure, decentralized. Petnames are believed to disprove this. The "homogenization of meaning" thesis: all communicable meanings should be signifiable through one common mechanism.
---

# Naming, petnames, and resolution

## The URL problem

URLs identify by location, not content. If you want to borrow George Orwell's "1984" from a friend, you ask for it by name. If Jesse gave you "Brave New World" instead, you'd notice. On the web, we ask for "the book on your bedroom shelf, third shelf from the ground, second from the left" — and if the shelf is reorganized, the book is gone.

This is the first major flaw of the web. Content-addressable files (IPFS-style hashing) fix the reference problem. Names are trickier.

Why has the search bar been merged into the address bar in most browsers? Why is search privatized and owned by Google/Microsoft/DuckDuckGo? Why does every website implement its own search?

## Zooko's triangle

According to [Zooko's Conjecture](https://en.wikipedia.org/wiki/Zooko%27s_triangle), you can only pick 2 of 3 when building network protocols for name resolution:
- Human-meaningful
- Secure
- Decentralized

[Petnames](https://en.wikipedia.org/wiki/Petname) are believed to disprove this conjecture.

In a human network, name resolution can be imagined as some function of the social graph. If I say "Do you know Donald?" — the answer depends on shared context. In a generalized information network, should it be any different?

## The homogenization of meaning

A communicable meaning is a meaning that has at least one encoding. There must be at minimum one encoding of a meaning and at minimum one agent which knows the decoding function to say that the meaning can be understood.

It would be extremely beneficial if all communicable meanings (the "signified" in a semiotic sense) are signifiable and resolvable through one common mechanism. On the web, the closest we have is the URL. A petname + content-addressable mechanism is the ideal solution.

```
Communicable Meaning → Multiple Encodings → Multiple Signifiers
Communicable Meanings → Single Encoding (Collision) → Single Signifier
```

The real Web of Meaning is in people's heads.

**The resolution function** is a function for the decentralized dereferencing of things — a traversal of a Hypergraph. The resolution function itself is a thing, referrable by its identifier.

Every identifier is produced by a homogenous identification function mapping things onto smaller things, called identifiers. A hashing function is a good contender for this. The normalization of things to encodings should not be enforced, but rather utilized as needed by agents on the network. The most popular encoding of a thing would win out over time.

Just like identifiers can collide, meaning can collide by overloading the same representation. This is why Context is required to resolve meaning. The collision of signifiers is rigorously understood under the mathematics of hashing functions. The collision of encodings (the overloading of meaning) is not as well understood.

We need to move from a web of information to a web of meaning.

## Naming in code

Consider capitalizing resolvable names within written language — like in German or TiddlyWiki, where ProperNouns are capitalized to denote that they refer to a resolvable, reified concept.
