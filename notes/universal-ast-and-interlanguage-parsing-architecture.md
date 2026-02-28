---
date: 2023-08-02
tags: [pal, uast, parsing, interlanguage, filesystem, environment, embedded-languages, architecture]
summary: Architecture for Pal's universal parsing layer. Any arbitrary input/file type maps through a parser into a UAST (Universal AST) stored in an in-memory environment synced with the filesystem. Extends "everything is a file" (Unix) with "everything is an object and everything is an AST." The type system selects matching parsers/evaluators and detects language boundaries for embedded languages. Parsers and evaluators are themselves programs. Critical architectural concept — the environment is the unifying abstraction across file types, languages, and runtimes.
---

# Universal AST and interlanguage parsing architecture

## Goal

Support any arbitrary input, file type, format, or language. The system has a type system that maps arbitrary input to a selection of matching parsers and evaluators. It must also support embedded languages, detecting language boundaries. It accepts contextual hints such as file extensions, web request content types, etc.

## Ideal architecture

```
input -> parser -> Environment(UAST)
```

The UAST (Universal Abstract Syntax Tree) is stored in an environment data structure that supports embedded languages.

## Environment design

The environment is synced with the filesystem and exists in memory. This overlays:
- Unix philosophy: **everything is a file**
- With: **everything is an object** and **everything is an AST**

This provides new system-wide generic interfaces.

## Parsers and evaluators

Parsers and evaluators are programs themselves. They rely on the default system implementations of parsers and evaluators where available. Each parser maps its input's AST to the system's UAST format.
