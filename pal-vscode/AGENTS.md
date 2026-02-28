# AGENTS.md — pal-vscode

> AI-audience orientation guide for the `pal-vscode` VS Code extension.
> @author claude

## What this is

A VS Code extension that exposes an **in-memory virtual filesystem** under the `palfs://`
URI scheme using the `vscode.FileSystemProvider` API. Users can browse, create, edit, and
delete files inside VS Code as if they were real files — but all data lives in RAM.

This extension is **separate from the LSP extension** (`pal-lsp/client/`). It provides the
filesystem-view of the Pal environment inside VS Code; the LSP extension provides language
intelligence.

## Architecture

```
VS Code
  └── extension.ts::activate()
        ├── registerFileSystemProvider("palfs", PalFS, { isCaseSensitive: true })
        └── registerCommand("palfs.*", ...)
              └── PalFS (fileSystemProvider.ts)
                    └── root: Directory
                          └── entries: Map<name, File | Directory>
```

## Source files

| File                        | Purpose                                               |
| --------------------------- | ----------------------------------------------------- |
| `src/extension.ts`          | Activation: registers `PalFS` provider and 5 commands |
| `src/fileSystemProvider.ts` | `PalFS` class + `File` / `Directory` nodes            |

## Commands

| Command               | Registered in  | Behavior                                                           |
| --------------------- | -------------- | ------------------------------------------------------------------ |
| `palfs.init`          | `extension.ts` | Create sample files / folders (idempotent guard via `initialized`) |
| `palfs.reset`         | `extension.ts` | Delete all root-level entries; set `initialized = false`           |
| `palfs.addFile`       | `extension.ts` | Write `palfs:/file.txt` with content `"foo"`                       |
| `palfs.deleteFile`    | `extension.ts` | Delete `palfs:/file.txt`                                           |
| `palfs.workspaceInit` | `extension.ts` | Add `palfs:/` as a VS Code workspace folder                        |

## PalFS API (fileSystemProvider.ts)

`PalFS` implements the full `vscode.FileSystemProvider` interface:

| Method                          | Notes                                                              |
| ------------------------------- | ------------------------------------------------------------------ |
| `stat(uri)`                     | Delegates to `_lookup(uri, false)`                                 |
| `readDirectory(uri)`            | Returns `[name, FileType][]` from the directory's `entries` map    |
| `readFile(uri)`                 | Returns `entry.data`; throws `FileNotFound` if `data` is undefined |
| `writeFile(uri, content, opts)` | Creates or overwrites file; fires `Created` or `Changed` event     |
| `rename(old, new, opts)`        | Moves entry between parent directories                             |
| `delete(uri)`                   | Removes entry from parent; updates parent `mtime` and `size`       |
| `createDirectory(uri)`          | Adds a `Directory` node to its parent                              |
| `watch(uri)`                    | No-op — fires for all changes regardless of watched URI            |

Change events are debounced 5 ms via `_fireSoon`.

## Missing pieces / gotchas

- **Not connected to Pal runtime**: `PalFS` is a pure in-memory store. It needs to subscribe
  to Pal Env events (`env/new`, `env/set`, `env/del`) and reflect them in the virtual FS —
  and vice versa — to achieve the "filesystem IS the environment" vision.
- **No persistence**: all data is lost on extension reload.
- `watch()` is a no-op stub (acceptable for simple impls, but means file-watching clients
  will get all-or-nothing notifications).
- The `initialized` flag in `extension.ts` leaks across `palfs.reset` + re-`init` calls
  if the extension host is not reloaded.

## Build

```bash
# From the pal-vscode/ directory
npm install
npx vsce package   # or: press F5 in VS Code to launch the Extension Development Host
```
