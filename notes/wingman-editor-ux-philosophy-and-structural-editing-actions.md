---
date: 2024-01-21
tags: [wingman, ux, editor, structural-editor, focus, input, automation, ide-philosophy]
summary: UX philosophy and structural editing action design for Wingman. User actions: close, open controls, undo/redo, unit navigation (token/expression/closure/statement), graph navigation (open definition, references, implementations, call hierarchy, refactor), multi-select, copy/paste/cut, comment-out, move up/down, edit. Focus mechanisms: eye-tracking (4-quadrant switching), brainwaves (concept switching), keyboard (arrows/shortcuts), mouse (click/hover). Design goals: reduce specialized UI elements, mould UI to user without requiring customization. Universal interfaces: graph view, command/search bar, floating action button, text panel. Automation philosophy: no manual save/test/commit — all happens automatically when code compiles/tests pass. Radical input rethinking: mouse should move the view (game-style), not a cursor; voice/eye-tracking/brain scanning preferred over button clicking. Important as the UX vision that distinguishes Wingman from conventional IDEs.
---

# Wingman: editor UX philosophy and structural editing actions

## User actions

- **Close**: application, project, view, peek/autocomplete
- **Open control**: control panel, search bar, voice
- **Undo / redo**
- **Unit navigation**: next token, expression, closure, statement
- **Graph navigation**: new unit, open definition, references, implementations, call hierarchy, refactor
- **Multi-select**, copy, paste, cut
- **Comment out** selected
- **Move selected** up / down
- **Edit**

### Focus/select semantics

- Click on something → goes to definition
- Click on the definition → makes it editable

## Focus mechanisms

- **Eye-tracking**: 4-quadrant focus switching
- **Brainwaves**: concept switching
- **Keyboard**: arrows, 1234, shortcuts
- **Mouse**: click, hover

## Design goals

- Reduce the number of specialized UI elements
- Mould the UI around the user without requiring customization from the user
- **Things to eliminate**: line numbering, filesystem view, distinct file/project search

## Universal interfaces

- Graph view
- Command / search bar
- Floating action button
- Text panel

## Automation philosophy

Programmers should only focus on solving the problem the software is set out to solve. The tooling handles everything else:

- **No manual save** — code is saved continuously
- **No manual test** — tests re-run every time the code can be compiled
- **No manual commit** — code is committed whenever tests are passing
- **Cost tracking** — track the cost of all actions and optimise trigger frequency to keep user performance high
- The user can tune how much compute to devote to the IDE, but individual settings (like linting toggles) are a waste of time

## Input rethinking

- Clicking a button with a mouse is very slow — voice, eye-tracking, brain scanning, or keyboard are all faster
- The default mouse behaviour (moving a cursor) is wrong — in a game, the mouse moves the *view* by default
- There should be minimal on-screen affordances (buttons, etc.)

## Code editing workflow (vision)

When changing a unit of code, the entire view should be dedicated to that unit, showing simultaneously:
- Real-time values
- Test results
- Compiler errors
- AI recommendations
- Documentation

Navigation transitions:
- **Horizontal**: dependency, dependents, siblings
- **Vertical (up)**: project management, code organization, integration-level tests/values
