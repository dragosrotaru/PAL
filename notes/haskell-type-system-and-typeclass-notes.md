---
date: 2024-01-21
tags: [research, haskell, type-system, typeclasses, functional-programming, currying]
summary: Concise Haskell reference notes covering key type system concepts. No mixed-type lists, default currying, partial application, polymorphic type variables, and core typeclasses (Eq, Ord, Show, Read). Includes function application operators ($, .) and binding constructs (where, let). Relevant to Pal's type system design — Haskell typeclasses are the inspiration for Pal's Extension TypeClasses (Traits in Rust).
---

# Haskell type system and typeclass notes

- No mixed type lists; lists differ from n-tuples; singleton tuples not allowed
- List ops don't automatically work on tuples
- Currying is default: `FN :: String -> String -> String`
- Partial application is default; no distinction between parameters and returns
- `head :: [a] -> a` — lowercase `a` is a type variable (polymorphic)
- `Eq` typeclass — equality; does not include monads or functions
- `Ord` — ordering, subclass of `Eq`
- `Show` and `Read` — writer and parser typeclasses
- `if`, `case`, and pattern matching build on each other
- `where` and `let` for binding
- `$` — lowest priority function application
- `.` — function composition
