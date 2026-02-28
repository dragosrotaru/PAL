---
date: 2023-08-02
tags: [pal, language, syntax, grammar, s-expressions, primitives, undefined]
summary: Formal syntax specification for the Pal language (ASCII-based S-expression syntax). Covers whitespace rules, escape sequences, sequence brackets, string embedding, number literals (#), booleans, null (deliberate non-value), and undefined (unexpected behaviour / meaninglessness). Notably there are no Exceptions or Errors — undefined is the single primitive for all unexpected states. Important as the authoritative reference for the pal-ts parser and pal-rs DSL.
---

# Pal language syntax specification

Assuming ASCII encoding:

- All whitespace characters are ignored and used only to separate symbols
- `\` — backslash escapes special characters, including itself
- `()` — brackets define a sequence or bound
- `""` — quotes define an embedding or string
- `#` at the beginning of a value defines a number
- `true` and `false` represent the booleans
- `null` represents deliberate non-value (Nothing)
- `undefined` represents unexpected behaviour and meaninglessness

## On undefined

There are no Exceptions or Errors in Pal. Instead, the `undefined` primitive represents any and all unexpected behaviour. Expected-yet-unintended behaviours will probably be modelled via something like Algebraic Data Types.
