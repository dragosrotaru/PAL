---
date: 2024-01-21
tags: [editor, ide, requirements, vscode, wingman, language-server, developer-experience]
summary: Two-part note on editor requirements. First, a list of VSCode extension points relevant to building Pal's IDE layer (Monaco, Language Servers, Debug Adapters, TextMate grammars, XTerm). Second, a list of desirable editor behaviors — hot reload, always-on tests, type-on-hover signatures, coverage, breadcrumbs, auto-bracket, git integration. Directly relevant to wingman and pal-lsp design goals.
---

# Ideal code editor feature requirements

## VSCode extension points (relevant to building Pal's IDE layer)

- Monaco Editor — embeddable editor
- Debug Adapters
- Keybindings API
- Language Servers (LSP)
- Themes
- Extensions
- Emmet (autocompletion)
- TextMate Grammar Files — syntax highlighting
- XTerm — terminal integration

## Desirable editor behaviors

- Automatic whitespace formatting when typing, saving, committing
- Always run tests on code
- Hot reload code when working on UI
- Autocomplete while typing
- Show type signature + documentation while typing and while hovering
- Go to definition on `command + click`
- Show code coverage
- Indent using spaces
- Show files and lines changed since last commit
- Show current branch
- Show breadcrumbs
- Auto-add closing bracket/tag/quotation (but detect if adding top bracket to close)
- Git integration features
- Support for many languages and file types
- Code folding
