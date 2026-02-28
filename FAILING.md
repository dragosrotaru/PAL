# FAILING.md — Pal Project Phase 1 Revitalization

_Generated: 2026-02-28_

## Summary

| Project | Install | Build | Test | Status |
|---------|---------|-------|------|--------|
| Rust workspace (pal-rs, pal-fs, pal-lsp, wingman) | ✅ | ✅ | ✅ | PASS |
| pal-ts/ | ✅ | ✅ | ✅ | PASS |
| pal-vscode/ | ✅ | ✅ | — | PASS |
| pal-lsp-example/ | ✅ | ✅ | — | PASS |
| pal-lsp/ | ✅ | — (no scripts) | — | SKIP |
| hyper/hyper-ts/ | ✅ | ✅ | — | PASS |
| hyper/hyper-fs/ | ✅ | ❌ | — | FAIL |
| hyper/hyper-server/ | ✅ | ✅ | — | PASS |
| hyper/hyper-web/ | ✅ | ❌ | — | FAIL |
| hyper/livecoding/ | ✅ | — (no build) | — | SKIP |
| rabbithole/ | ✅ | — (no build) | — | SKIP |

---

## Build Failures

### hyper/hyper-fs — Missing modules (unimplemented stubs)

**Command:** `pnpm run build`
**Label:** Deferred to upgrade phase

The following source modules are referenced but never implemented:

| Import path | Importing file |
|-------------|----------------|
| `../password` | `src/device/index.ts`, `src/owner/index.ts`, `src/index.ts` |
| `../../hash-id` | `src/file/id/index.ts` |
| `../../../../common/src/models/value-objects/symmetric-key` | `src/owner/index.ts` |
| `../../object-type-guard` | `src/storage-backends/config/index.ts` |

**Additional errors (downstream of missing modules):**
- `src/file/index.ts(19)`: Expected 0 arguments, but got 1 (constructor arity mismatch)
- `src/fuse/index.ts(100-101)`: Property `bytes` does not exist on `FileID`
- `src/storage-backends/config/index.ts(34-57)`: `input` is of type `unknown` (missing guard from `object-type-guard`)

**Root cause:** The `password`, `hash-id`, `object-type-guard`, and external `common/` modules were planned but never created. This is a fundamental architecture gap requiring new module implementations, not a simple fix.

---

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

---

## Install Failures

### hyper/hyper-web — `y-dat@0.0.1` broken git dependency

**Label:** Deferred to upgrade phase

`y-dat@0.0.1` depends on `dat-sdk@1.0.3` which tries to resolve git branch `v9` from `git@github.com:mafintosh/hyperdrive.git`. This ref no longer exists on GitHub.

**Workaround applied:** Removed `y-dat` from `hyper/hyper-web/package.json` dependencies to allow install to proceed. Any code importing from `y-dat` will fail at build time (but currently no source files import it directly — it was an unused dependency).

---

## Infrastructure Notes

### macFUSE / pkg-config

The Rust `fuser` crate requires `osxfuse` via pkg-config, but macFUSE installs as `fuse.pc` (not `osxfuse.pc`). A local alias was created at `/tmp/pkgconfig/osxfuse.pc`.

**Required to build Rust workspace:**
```sh
PKG_CONFIG_PATH="/tmp/pkgconfig:/usr/local/lib/pkgconfig" cargo build
PKG_CONFIG_PATH="/tmp/pkgconfig:/usr/local/lib/pkgconfig" cargo test
```

**Permanent fix options (choose one):**
1. `sudo ln -sf /usr/local/lib/pkgconfig/fuse.pc /usr/local/lib/pkgconfig/osxfuse.pc`
2. Add to shell profile: `export PKG_CONFIG_PATH="/tmp/pkgconfig:/usr/local/lib/pkgconfig:$PKG_CONFIG_PATH"`
3. Upgrade `fuser` crate to a version that recognizes `macfuse`/`fuse` names directly

### hyper/hyper-web — webpack 4 + Node 24 OpenSSL incompatibility

webpack 4 uses legacy OpenSSL hash algorithms removed in Node 17+. Applied workaround: `NODE_OPTIONS=--openssl-legacy-provider` prepended to all scripts in `hyper/hyper-web/package.json`. Build still fails due to the missing `routines` module above.

**Permanent fix:** Upgrade react-scripts from 4.0.3 to 5.x (uses webpack 5 which is Node 17+ compatible). Deferred to upgrade phase.


### package.json — TypeScript version upgrades

- `pal-vscode`: upgraded TypeScript `^3.9.4` → `^5.3.3` (required by `@types/vscode@1.109.0`)
- `pal-ts`: upgraded `@types/node` `^14.18.54` → `^22.0.0` (required for Node 24 compatibility with TypeScript 5.x)
