# specialforms/

Each file defines one special form as a module exporting `Identifier`, `Form` type, `Is` guard, and `Apply` function.
The evaluator in `core/evaluator.ts` imports all of these and dispatches by identity check.

## Forms

| Form        | Syntax                        | Purpose                                                                                      |
| ----------- | ----------------------------- | -------------------------------------------------------------------------------------------- |
| `apply`     | `(proc args)`                 | Calls a procedure with arguments; spreads list args.                                         |
| `eval`      | `(eval expr)`                 | Double-evaluates: evaluates expr, then re-evaluates the result if it changed.                |
| `gpt`       | `(gpt expr)`                  | Sends expr to OpenAI; loops over tool calls (eval/envget/envset); returns parsed code block. |
| `lambda`    | `(lambda (args) body)`        | Creates a lexically-scoped async procedure.                                                  |
| `macro`     | `(macro pattern template)`    | Registers a syntactic macro; expands at evaluation time.                                     |
| `parse`     | `(parse string)`              | Parses a PAL string to AST.                                                                  |
| `quote`     | `(quote expr)` or `` `expr `` | Returns expr unevaluated.                                                                    |
| `self`      | `self`                        | Replaces itself with the enclosing AST (anonymous recursion).                                |
| `ui`        | `(ui id)` or `(ui)`           | Opens the browser GUI for a given env entry.                                                 |
| `exit`      | `exit`                        | Terminates the process immediately.                                                          |
| `quit`      | `quit`                        | Terminates the process immediately (duplicate of exit).                                      |
| `env/index` | `env`                         | Returns all env entries as a list of pairs.                                                  |
| `env/set`   | `(env/set id val)`            | Sets an env key.                                                                             |
| `env/del`   | `(env/delete id)`             | Deletes an env key.                                                                          |

## Pattern

```ts
export const Identifier = Symbol.for("name");
export type Form = [typeof Identifier, ...];
export const Is = (ast: Lang.AST): ast is Form => ...;
export const Apply = (ctx) => (ast: Form) => ...;
```

## Missing Pieces

- `envset` tool in `gpt.ts` is declared to the LLM but never executed.
- Macro expansion is non-recursive (sub-list macros not expanded).
- `quit` and `exit` are identical — one should be removed or aliased.
- Backtick quote form requires parser support.

@author claude
