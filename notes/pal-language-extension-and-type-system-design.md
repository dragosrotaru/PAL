---
date: 2023-08-12
tags: [pal, type-system, language-extensions, refinement-types, overloading, parsers, lisp, pal-ts]
summary: Deep design notes on Pal's type system and Language Extension model. Types form a hierarchy (Object > Atom/List, Atom > primitives). Extensions can introduce new atom types, refinement types (subsets of existing), new functions, and new composite types. Operators are overloaded by argument type match. Parsing uses a "clue" (tag) system at IO boundaries with a path toward tag inference. Critical design document for the pal-ts evaluator — the type system must be both native (for guards/equality) and exposed as a language construct.
---

# Pal language extension and type system design

## JSON edge cases for `Is` type guard

Edge cases that expose the limits of the current evaluation function:

| Input | JSON | Core |
|---|---|---|
| `[{ a: undefined }]` | ✗ | ✗ |
| `""` | ✓ | ✓ |
| `{ a: "a" }` | ✓ | ✗ |
| `Symbol` | ✗ | ✓ |

These edge cases are not sufficiently expressed in the evaluation function. A more robust typechecking approach is needed.

## Type hierarchy

```
Object
├── Atom           (primitive values)
│   ├── String
│   │   ├── SpanishWord
│   │   ├── EnglishWord
│   │   └── UUID       (refinement — subset of String with format)
│   ├── Number
│   │   └── Money      (distinct from float — different operations)
│   └── ...
└── List           (composite, composed from Objects)
```

Key observations:
- `Atom` is a subtype of `Object`
- Each primitive is a subtype of `Atom`
- `List` is a subtype of `Object`
- A type can be in multiple type hierarchies (e.g., a word in both `SpanishWord` and `EnglishWord`)
- Types that share the same meaning are only equal if they refer to the same definition — type equality is structural unless opaque

## Language Extensions

Every Language Extension can introduce some combination of:

1. **A new Atom type** — a totally new atom with internal representation that deviates from core primitives. Example: `Money` as `[currency, dollars, cents]` — not a float, operates with different logic.

2. **A refinement on an Atom type** — a subset of an existing type with a specific format. Examples: UUID (subset of String), URL.

3. **A new Function type** — overloading existing operators for particular type matches, or defining new functions entirely.

4. **A new List (composite) type** — a composite of specific shape and contents that belongs to a named type. Opaque types are composites that forbid access to the internal representation.

### Example: type refinement behavior

```
(+ Money Money)         ; requires Money-specific + overload
(Shorten 10 UUID)       ; shortening a UUID yields a String, not a UUID
(Hash String)           ; returns String
```

Any function defined on an upstream type, applied to a downstream type, should return an object of the downstream type unless it fails to maintain its type invariants. Functions should be overloadable — the environment must pattern-match on argument types, not just symbol lookup.

### Example: defining a new type

```
from Object.String
name Colors
is (lambda (x) (equal x "red") ... matches ...)
retain ...
define combine a b ... ; hex combination
```

Everything is a function: `"hello world"` = `(string.object hello world)` (constructor). The constructor function IS the parse function.

### Open question

Are Language Extensions the same as types? Should there be a unified type system underlying both? The big question is how extensions compose alongside each other — we need a consistent, composable interface where extensions can build on top of each other.

## Parsing and writing

This is the IO boundary of the system. Parsing uses a `clue` concept (tags), with a catchall as text. This simplifies typechecking to a lookup as long as the tag system is well-defined.

The metaphor breaks down with embedded languages unless embeddings are tagged (e.g., `\`\`\`js` code blocks).

**Tag inference** — a differentiation algorithm to enable tagless parsing. Looks like type inference, especially with subtypes of JSON or CSV where the parser can work in multiple stages. Aliases for tags and alias management will be necessary. Parsers should be composable — reusable components for primitives.

## Exposed type system

Whatever guards and type-checking are used in the host must also be exposed in the language itself — especially `typeof` and equality. It is imperative to have a cohesive type system, not something thrown together. Possible to bootstrap by relying on a subset of the TypeScript type system.

Type-checking is required for:
- Environment setting (variable annotation)
- Function application

## Key design decisions needed

- How to handle type equality when two types have the same meaning but different definitions
- Whether to use opaque types everywhere or allow structural typing
- `JSON.Object` should be an opaque primitive — fix infinite recursion with `IsList`
- Research implementing a SemanticJSON that fully supports native types and represents objects as lists
