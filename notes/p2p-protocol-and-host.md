---
date: 2024-01-21
tags: [hypergraph, p2p, protocol, host, interpreter, subscription, signatures, repl, changetheweb]
summary: P2P subscription model for HyperGraph nodes. A Host Interpreter subscribes to changes to itself by sending subscriptions to trusted neighbours, filtered by agent signature. Hosts verify signatures and maintain reputation tallies for neighbours. The Host is a networked REPL (Lisp/C/Rust) that can self-update by downloading and applying changes to its own Interpreter HyperGraph.
---

# P2P protocol and host

## Subscription model

A Host Interpreter subscribes to changes to itself by sending a subscription to the name of itself to some number of its trusted neighbours. Because it only wants to listen to changes signed by a specific agent (the creator), it includes the agent signature verification information in the subscription.

This subscription needs to be propagated to create at least one (preferably more) paths to the creator agent. There needs to be an algorithm to determine which and how many neighbours to trust with the subscription.

## Signature verification and reputation

Hosts verify signatures and refuse to propagate malformed messages (or messages published for something else that occupies the same name). They keep a tally of naughty neighbours and may punish or outright refuse connections from them.

## Applying updates

The message is received and the owner agent of the Host can apply the update. The update is applied to the Interpreter HyperGraph.

## The Host runtime

The Host is at its core a networked REPL written in Lisp, C, or Rust. The base interpreted language is just lambda calculus, with notation for evaluation. Extensions are made using the Interpreter HyperGraph.

A node can be an embedded hypergraph — there is no need to normalize everything to the hypergraph. Every Node and Edge must include its own encoding so that the language can be extended through a type system. Otherwise, every extension will be limited to S-expressions, Church encodings, and binary data types.

## Self-updating host

We would also like a way to update the Host itself. This could be done in the same way as content updates, but the process would have to restart itself from the new binary (or compile source code and restart itself).
