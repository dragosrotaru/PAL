---
date: 2024-01-21
tags: [reference, vscode, emacs, keybindings, editor]
summary: Personal keybindings reference for Emacs and VSCode. Covers Emacs modifier notation, and VSCode commands for navigation, file state, content modification, and focus management. Useful context when designing Pal's editor (wingman) key handling.
---

# VSCode and Emacs keybindings cheatsheet

## Emacs key notation

- `C` = Ctrl
- `M` = Alt
- `C-x C-x` = Exit Emacs
- `C-g` = Exit Partially Entered Command
- `C-x k <return>` = Stop Tutorial
- `M-v` = Up Page
- `C-v` = Down Page

## VSCode

### Application

| Action | Shortcut |
|---|---|
| Quit | `command + q` |
| Close window | `command + w` |

### Universal

| Action | Shortcut |
|---|---|
| Command palette | `shift + command + p` |
| Find | `command + f` |
| Find selected | `command + e` |
| Find in files | `shift + command + f` |

### UI Navigation

| Action | Shortcut |
|---|---|
| Toggle sidebar | `command + b` |

### File state

| Action | Shortcut |
|---|---|
| New file | `command + n` |
| Save | `command + s` |
| Undo | `command + z` |
| Redo | `shift + command + z` |

### Content navigation

| Action | Shortcut |
|---|---|
| Go to start of file | `command + up` |
| Go to end of file | `command + down` |
| Go to start of line | `command + left` |
| Go to end of line | `command + right` |
| Go one token left | `option + left` |
| Go one token right | `option + right` |

### Content modification

| Action | Shortcut |
|---|---|
| Cut | `command + x` |
| Copy | `command + c` |
| Paste | `command + v` |
| Copy one token left | `shift + option + left` |
| Copy one token right | `shift + option + right` |
| Copy line below | `shift + option + down` |
| Copy line above | `shift + option + up` |
| Copy to start of file | `shift + command + up` |
| Copy to end of file | `shift + command + down` |
| Copy to start of line | `shift + command + left` |
| Copy to end of line | `shift + command + right` |
| Move line down | `option + down` |
| Move line up | `option + up` |
| Indent right | `command + ]` |
| Indent left | `command + [` |
| Comment out section | `shift + option + a` |

### Focus / selection

| Action | Shortcut |
|---|---|
| Select all | `command + a` |
| Add next occurrence | `shift + command + d` |
| Select all occurrences | `shift + command + l` |
