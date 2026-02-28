# language/

AST types, type system, parsers/serializers, and type class interfaces.

## Components

| File/Dir          | Purpose                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `ast.ts`          | Three-layer AST union: Core primitives (ID, Boolean, Number, String, Null, Undefined), Extensions (CSV, JSON), Composite `Lang.AST`. |
| `typesystem.ts`   | `STATIC` static guards + `TypeSystem` class for nominal typing (file extension → type) and structural/value equality.                |
| `typeclasses.ts`  | Haskell-inspired type class interfaces: Guard, Equality, Write, Parse, UI, Order, Numeric, Functor, Monad.                           |
| `list.ts`         | `TSList` concrete type class implementation — stubs for write/parse, not yet wired into TypeSystem.                                  |
| `guards/json.ts`  | Runtime type guards for the JSON AST extension.                                                                                      |
| `parser/index.ts` | Extension→parser dispatch: routes `.pal`, `.csv`, `.json`, `.txt` to the correct sub-parser and serializer.                          |
| `parser/pal.ts`   | Recursive descent S-expression parser + serializer. Character-by-character tokenizer.                                                |
| `parser/csv.ts`   | CSV parser (quoted fields, no header enforcement) + serializer.                                                                      |
| `parser/json.ts`  | Thin wrapper around `JSON.parse`/`JSON.stringify`.                                                                                   |
| `primitives/`     | Concrete type class impls (TSBoolean, TSString, TSNumber) — not yet registered in TypeSystem.registry.                               |

## Nominal Typing

Type identity is encoded in a symbol's `description` field: the last dot-delimited segment is the type name.
Example: `Symbol.for("foo/bar.json")` → nominal type `"json"`.

## Missing Pieces

- `TypeSystem.alias()` is a no-op stub.
- `TypeSystem.shapeEquals()` throws "not implemented".
- `TypeSystem.structuralTypeOf()` has a broken guard that always throws.
- `TSList`, `TSBoolean`, `TSString`, `TSNumber` are not registered in TypeSystem.
- Functor/Applicative/Monad are declared but nothing implements them.
- PAL parser only handles one expression per parse call (no multi-expression program parsing).

## Gotchas

- The PAL parser's empty-list detection has a regex bug (`/S+/` instead of `/\s+/`).
- Backtick quoting is recognized in `quote.ts` but not handled by the tokenizer.

@author claude
