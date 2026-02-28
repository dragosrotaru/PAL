# core/

The runtime kernel of the Pal interpreter.

## Components

| File                | Purpose                                                                                                                                                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `environment.ts`    | Proxy-wrapped reactive Map<ID, AST>. Fires events (`env/new`, `env/set`, `env/del`, `env/sub`, `env/unsub`, `env`) so subscribers react to state changes. Change detection via `valueEquals` prevents no-op notifications. |
| `evaluator.ts`      | The eval-apply recursion. Dispatch priority: primitives → JSON objects → macro expansion → special forms → procedure application → ID lookup → list fixpoint.                                                              |
| `filesystem.ts`     | Bidirectional chokidar-based FS↔env sync. File path = symbol key; file extension = parser clue. Prevents loops by unsubscribing before env writes, resubscribing after.                                                    |
| `messageHistory.ts` | GPT conversation history persisted to the env (and thus disk). Subscribes to the history JSON file so it can be hot-edited externally.                                                                                     |

## Invariants

- `env.map.set()` goes through the Proxy — never bypass it with the underlying Map directly.
- `FileSystem.ROOT` is hardcoded to `"test"` — only files in that directory are watched.
- `evaluate()` is pure (no side effects) except for `gpt` and `ui` special forms which call external services.

## Missing Pieces

- `FileSystem.ROOT` should be configurable, not hardcoded.
- `GPTMessageHistory.append()` has a double-write bug (sets `_history` then calls `env.map.set` with a second concat).
- No serialization for non-JSON/CSV/PAL types (e.g. procedures cannot round-trip through the filesystem).

## Gotchas

- Evaluating a plain `Lang.ID` symbol does a recursive `ctx.eval` on the looked-up value — infinite loops are possible if values reference themselves.
- List evaluation is unordered (`Promise.all`) — side-effecting forms in a list execute in parallel.

@author claude
