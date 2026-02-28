# AGENTS.md — pal-lsp-example

> AI-audience orientation guide for the `pal-lsp-example` VS Code extension skeleton.
> @author claude

## What this is

A minimal VS Code extension template that wires up an LSP client for `.pretty` files.
The `serverOptions.command` field is empty — this is an unfilled placeholder.

The real LSP client lives in `pal-lsp/client/src/extension.ts`.

## File

| File | Purpose |
|------|---------|
| `src/extension.ts` | `activate`/`deactivate` skeleton; LanguageClient for `.pretty` |

## Status

Stub — not functional without filling in `serverOptions.command`.
