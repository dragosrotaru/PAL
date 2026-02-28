# FAILING.md — Pal Project Revitalization

_Updated: 2026-02-28 (Phase 3: tsgo migration + vitest)_

## Summary

- outdated rust fuser lib not recognizing fuse.pc
- outdated webpack 4 hyper-web
- missing y-dat dependency hyper-web
- missing routines hyper-web
- unimplemented stubs hyper-fs

---

### macFUSE / pkg-config

The Rust `fuser` crate requires `osxfuse` via pkg-config, but macFUSE installs as `fuse.pc` (not `osxfuse.pc`). A local alias was created at `/tmp/pkgconfig/osxfuse.pc`.

**Required to build Rust workspace:**

```sh
PKG_CONFIG_PATH="/tmp/pkgconfig:/usr/local/lib/pkgconfig" cargo build
PKG_CONFIG_PATH="/tmp/pkgconfig:/usr/local/lib/pkgconfig" cargo test
```

**Permanent fix options (choose one):**
Upgrade `fuser` crate to a version that recognizes `macfuse`/`fuse` names directly

### hyper/hyper-web — `y-dat@0.0.1` broken git dependency

**Label:** Deferred to upgrade phase

`y-dat@0.0.1` depends on `dat-sdk@1.0.3` which tries to resolve git branch `v9` from `git@github.com:mafintosh/hyperdrive.git`. This ref no longer exists on GitHub.

**Workaround applied:** Removed `y-dat` from `hyper/hyper-web/package.json` dependencies to allow install to proceed. Any code importing from `y-dat` will fail at build time (but currently no source files import it directly — it was an unused dependency).

### hyper/hyper-web — webpack 4 + Node 24 OpenSSL incompatibility

webpack 4 uses legacy OpenSSL hash algorithms removed in Node 17+. Applied workaround: `NODE_OPTIONS=--openssl-legacy-provider` prepended to all scripts in `hyper/hyper-web/package.json`. Build still fails due to the missing `routines` module above.

**Permanent fix:** Upgrade react-scripts from 4.0.3 to 5.x (uses webpack 5 which is Node 17+ compatible). Deferred to upgrade phase.

### hyper/hyper-web — Missing `routines` model module

**Command:** `pnpm run build`
**Label:** Deferred to upgrade phase

**Error:**

```
./src/views/ram/index.tsx
Cannot find file '../../models/routines' in './src/views/ram'.
```

`src/views/ram/index.tsx` imports `{ morning, work, lunch, night }` from `../../models/routines`, but this module was never created. The `src/models/` directory only contains `namespace/`, `task/`, and `wildcards/`.

**Root cause:** The `routines` model is an unimplemented stub. Requires creating the module with the appropriate exported constants/functions.

### hyper/hyper-fs — Missing modules (unimplemented stubs)

**Command:** `pnpm run build`
**Label:** Deferred to upgrade phase

The following source modules are referenced but never implemented:

| Import path                                                 | Importing file                                              |
| ----------------------------------------------------------- | ----------------------------------------------------------- |
| `../password`                                               | `src/device/index.ts`, `src/owner/index.ts`, `src/index.ts` |
| `../../hash-id`                                             | `src/file/id/index.ts`                                      |
| `../../../../common/src/models/value-objects/symmetric-key` | `src/owner/index.ts`                                        |
| `../../object-type-guard`                                   | `src/storage-backends/config/index.ts`                      |

**Additional errors (downstream of missing modules):**

- `src/file/index.ts(19)`: Expected 0 arguments, but got 1 (constructor arity mismatch)
- `src/fuse/index.ts(100-101)`: Property `bytes` does not exist on `FileID`
- `src/storage-backends/config/index.ts(34-57)`: `input` is of type `unknown` (missing guard from `object-type-guard`)

**Root cause:** The `password`, `hash-id`, `object-type-guard`, and external `common/` modules were planned but never created. This is a fundamental architecture gap requiring new module implementations, not a simple fix.

---

## Remaining Deferred Items (Phase 2)

### openai v3 → v5 (pal-ts)

`pal-ts` uses `openai@^3.3.0`. The v3→v4→v5 rewrites completely changed the API. Deferred: requires source-level migration of all GPT calls.

### hyper/hyper-web — monaco-editor-webpack-plugin incompatibility

The craco build fails because `monaco-editor-webpack-plugin@3.1.0` cannot find internal monaco-editor modules from `monaco-editor@0.52.2` (paths changed between versions). Requires upgrading to a compatible plugin version or migrating off CRA/craco entirely.

---

## Fixes Applied in Phase 2

### pal-vscode/src/fileSystemProvider.ts — Node.js Timer type incompatibility

- **File:** `pal-vscode/src/fileSystemProvider.ts:205`
- **Before:** `private _fireSoonHandle?: NodeJS.Timer;`
- **After:** `private _fireSoonHandle?: ReturnType<typeof setTimeout>;`
- **Reason:** `@types/node@22` made `NodeJS.Timer` incompatible with `clearTimeout`'s expected parameter type.

### hyper/hyper-server/src/compiler.ts — ts.visitNode return type

- **File:** `hyper/hyper-server/src/compiler.ts:263`
- **Before:** `return ts.visitNode(rootNode, visit);`
- **After:** `return ts.visitNode(rootNode, visit) as T;`
- **Reason:** TypeScript 5.x narrowed the return type of `ts.visitNode` to `T | undefined`; the `TransformerFactory<T>` signature requires returning `T`.

### hyper/hyper-server/tsconfig.json — `baseUrl` removed in tsgo

- **File:** `hyper/hyper-server/tsconfig.json`
- **Before:** `"baseUrl": "src"` present
- **After:** removed
- **Reason:** tsgo 7.x removed `baseUrl` as a compiler option. No source files used baseUrl-relative non-package imports, so removing it has no effect on resolution.

## Fixes Applied in Phase 3

### All TypeScript packages — build tool migrated from `tsc` to `tsgo`

All `build` and `start` scripts across every TypeScript package now use `tsgo` instead of `tsc`. The `watch` scripts likewise use `tsgo --watch`.

### pal-ts/src/libraries/functions/list.test.ts — migrated to vitest

Rewrote the hand-rolled test runner as a proper vitest test suite using `describe`/`it`/`expect`. Removed the obsolete `src/test.ts` entry point. The `test` script in `pal-ts/package.json` now runs `vitest run`.
