---
date: 2024-01-21
tags: [language-design, lisp, nodes, names, identifiers, repl, s-expressions, evaluation, changetheweb]
summary: Original articulation of the Pal programming model. Like Lisp, atoms are Nodes and lists are Edges. A Name is like a Lisp Symbol — resolves to an Identifier, which resolves to Information. The development environment is a REPL where each expression is numbered by default. HTML is representable in S-expressions. Two-language approach: lambda calculus for graph computation, an impure language for interactive interfaces.
---

# Programming model: nodes, names, REPL

## Core model

Like Lisp, you have atoms and lists. In our lingo, **Atoms are Nodes** and **lists are Edges**.

A Node contains any arbitrary binary information. There are 2 special types of Nodes:
- **Identifier** — the content-addressed hash of a thing
- **Name** — like a Symbol in Lisp; resolves to an Identifier, which resolves to Information

The Name is resolved in the context of the **NameSpace**, which is defined in the program runtime.

## Development environment

In the development environment, each expression is numbered (like line numbers, but indexing expressions). This is the default namespace of the runtime context and the default Identifier.

A name is optionally given to an expression by the programmer, but the number-based naming system is maintained. Special characters are used to type nodes in an expression, specifying whether the programmer is referring to information, an identifier, or a name. This is resolved with a resolution function defined in the runtime.

The development environment is an interface which resolves information to graphical (initially textual) representations based on the encoding of the information. **The divide between development environment and browser should be removed.**

## S-expressions and HTML

HTML is representable in S-expressions. There may be a clean way to migrate the WWW to this new paradigm. Context-Free Grammars may help here. Normalizing HyperEdges to S-expressions (nested ordered pairs) needs evaluation.

There is no reason to stick to Polish notation if we can define interfaces for data encodings. One should be able to switch between representations of information freely — these concerns should be decoupled.

From Shriram Krishnamurthi: given semantics of two languages L and L+F (where F is an extension of L), if some program P in L is the result of "expanding" from P in L+F, then P in L is equal in meaning to P in L+F. We store P in L, and the collapsing of P to L+F becomes syntactic sugar in the User Interface.

## Two-language approach

**The REPL/runtime lock-in problem:** if we decide on a particular REPL/runtime, there is lock-in like with JavaScript. If you take the WASM/EVM route, you lose the semantic connection between code.

**Best of both worlds:**
- A formal lambda calculus-based language for computations on the graph (pure, verifiable, memoizable)
- An impure language built for interactive computation and producing interfaces

This decouples semantic computation from UI/interaction.

## Network memoization

A computation itself is an object in our language which can be cached across different runtimes (network memoization). Next: dive into Lambda Calculus to figure out how to represent functions and their results as objects.

## Why Lisp

Lisp is interesting due to its homoiconicity. Related work found by searching "Lisp HyperGraph" and "Lisp new Web":

- [GraphBrain](https://github.com/graphbrain) — hypergraph knowledge base
- [HyperRank](https://dejanmarketing.com/introducing-hyperpagerank/) — hypergraph PageRank
- [LISP Protocol (LISP)](https://en.wikipedia.org/wiki/Locator/Identifier_Separation_Protocol) — Locator/Identifier Separation Protocol for routing
- [Hierarchical Hypergraphs for Knowledge-centric Robot Systems](https://www.semanticscholar.org/paper/Hierarchical-Hypergraphs-for-Knowledge-centric-a-Scioni-Huebel/1347f3e9d21176fea46a4a5780a01cbb0c4bb733)
- [CLOS In-Memory HyperGraph](https://github.com/delaray/hypergraph) — Common Lisp Object System implementation
- [Extending the LISP model](https://www.youtube.com/watch?v=7v9WO1YKiz8)
- [COLAB: Knowledge Representation and Compilation Laboratory](https://www.cs.cmu.edu/afs/cs/project/ai-repository/ai/areas/kr/systems/colab/0.html)
- [RobMoSys HyperGraph-ER](https://robmosys.eu/wiki-sn-01/modeling:hypergraph-er)

## Further reading

- [IETF RFC Candidate for Canonical S-Expressions — Ron Rivest](http://people.csail.mit.edu/rivest/Sexp.txt)
- [Common Lisp, The Language](https://www.cs.cmu.edu/Groups/AI/html/cltl/cltl2.html)
- [Ethereum Recursive Length Prefix](https://github.com/ethereum/wiki/wiki/RLP)
- [Hash Consing](https://en.wikipedia.org/wiki/Hash_consing)
- Recursive Functions of Symbolic Expressions and Their Computation by Machine, Part I — John McCarthy
