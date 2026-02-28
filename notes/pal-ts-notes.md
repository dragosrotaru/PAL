---
date: 2024-01-21
tags: [pal-ts, language, scratch]
---

# pal-ts scratch notes

## Language design fragments

In JS we can represent opaque types as arrays by changing the prototype and adding `.opaque`.

Whitespace beyond a single space between tokens can be completely ignored. Artistic whitespace
is a special case to accommodate later — no need to build the core around it.

## Priorities (still valid)

We need to figure out the semantics of the environment and filesystem first, get that down pat. Then the language. Then we need to get to the point where we can use AI to generate the rest of it — which requires generate → save → experiment to be effortless. The UI will come as a natural consequence of that. Implement a universal parser. Implement a language server, then a client.
