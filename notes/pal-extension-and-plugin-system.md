---
date: 2024-01-21
tags: [pal, extensions, plugins, macros, parsers, typeclasses, traits, language-design]
summary: Design sketch for Pal's extension and plugin system. Extensions sit between Macro and Primitive — each is its own language with a Parser, Writer, unique file extension, and representations in multiple mediums (filesystem, GUI). Extensions implement TypeClasses (Traits in Rust) for composability. Plugins add orthogonal feature sets. Important because this is the mechanism by which Pal becomes a meta-environment — new file types become new languages.
---

# Pal extension and plugin system

## Extensions

You can think of Extensions as something in between a Macro and a Primitive. Each Extension is its own language. It implements:

- A Parser and Writer
- A unique file extension
- Representations in different mediums (filesystem, GUI)

Extensions implement TypeClasses (Traits in Rust), which enable the composability and interactability of different Extensions.

## Plugins

Plugins add orthogonal feature sets to Pal. (stub — more on this later)
