---
date: 2023-08-09
tags: [vision, motivation, philosophy, wingman, pal-ts]
summary: Why Pal exists and what it is — philosophical motivation, core product vision, and scope.
---

# Pal Vision

## Why this exists

This project is the pursuit of a better personal computing experience.

In systems design our primary tool is abstraction. Abstraction allows us to build on top of prior or parallel work by lowering the dimensionality of the mental model needed to integrate constituent components. The implementation is substituted for the interface.

This has obvious benefits, but also pitfalls. Each suboptimal abstraction is a design choice that is a local minima in the solution space. Because of external pressures to deliver working software on time, the typical design algorithm employed by designers is greedy.

Objectively we can say:

1. Design decisions made in the past were made on less information than we have now.
2. Typical software enterprises reward individuals for delivering and punish them for questioning requirements.
3. Empirically we know that large refactoring undertakings can be risky.
4. There is an inherent bias in assignment of risk — it's easy to attribute failure to an explicit decision to do something, rather than an implicit decision not to do something.
5. Unless you have a way to quantify the risk for both the option to refactor and the option to not refactor, any discussion of risk is ungrounded.
6. Individuals are not incentivized to care about the repercussions of their decisions past the scope of their tenure.
7. There is no law of nature which states that all methodologies for refactoring abstractions carry the same risk.

All of these factors form the basis for how we make design decisions today. It is not a basis founded in logic, like that of the pioneers of our field. It is a vicious cycle of short-sighted thinking and disposable software.

As we approach the 100-year anniversary of general purpose computing, it is important to look back at the work of the giants before us with a critical eye. Perhaps there is a better maxima we can teleport to from our current position using more advanced tooling.

## Key decisions in the stack to analyze

Like sediment layers or ice core samples, our software stack shows its history. The typical web development stack:

- **Hardware** — closed source, von Neumann / Turing machine vs Lisp machine
- **OS** — Unix everything-is-a-file, C as de facto language, OSI networking, shell
- **Web** — DOM, HTTP, browser, WebKit, JavaScript

## What Pal is

A **personal AI programming environment** — a re-imagination of personal computing.

- Fast, batteries included, private, offline-first, decentralized, open source
- Extends existing communities where possible; interoperates with existing paradigms where possible
- Lowers the barrier of entry for programmers without compromising quality or performance

The tool enables humans of all skill levels to cooperate. Some people write natural language descriptions of software. Other people/agents take those descriptions and turn them into more accurate descriptions. There is a fluid refinement. Descriptions become code, which is refined further. Skilled developers can improve performance or restructure for readability. Engineers and scientists can write high-performance compiler extensions in Rust.

At the bottom of the pyramid, you need to be able to extend the system by writing Rust directly.

When AI is able to easily perform language-to-language translation, it doesn't really matter what language you write in. When AI can learn from code, does it make sense to have libraries/modules? All code is part of the standard library. You can imagine a universal library of code where each unit has tests, documentation, and various implementations in various languages.

## Core scope

**Filesystem integration**
The namespace of objects closely matches the filesystem. Most concrete objects are represented as a file or folder. An object can be edited as a file or with the UI. This allows users to use any other application to modify their data, outsource backups/syncing/versioning to trusted tools like git and syncthing, and makes the system immediately useful even when the UI isn't fully fleshed out.

**Unified language and data model**
All data is represented in an easy-to-understand AST. The language provides simple manipulation mechanisms and a basic type system that an average person can understand. A person can use natural language to query the data or write expressions in the language. A powerful homoiconic modelling paradigm enables features that don't exist in any other tool.

**UI integration**
The UI is easily modified, extended, and customized. A playground for creativity.

**Sharing**
People should be able to publish their work to a website, collaborate via git, and safely publish and import data and code. Mobile app, web extension, VS Code integration, and connector library for external data sources.

**Performance**
The system should be very fast.

## North star: force multiplication

Find the most powerful kernel possible — pack the language with expressiveness and extensibility:

- Adaptive grammar and universal parsing
- Adaptive compute/evaluation model
- Powerful foundational constructs/special forms
- Expose every internal to the language

Implement powerful interfacing capabilities:

- Adaptive/Generative UX/GUI
- REPL/CLI, VSCode Extension, OS Primitives, Web Extension, Web Browsing
- Brain-Computer Interface, External Systems

Automation and intelligence:

- Search, Analytics, Inference, Symbolic Engines
- Generative Loops

**Theoretical force multiplier:** take the definition of every capability of your system and pass it to an LLM, generating a description of its utility. Produce a prompt that takes these capabilities and composes them to produce more value.
