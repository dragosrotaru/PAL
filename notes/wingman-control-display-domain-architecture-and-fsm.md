---
date: 2024-01-21
tags: [wingman, architecture, fsm, state-machine, command-pattern, display, domain, winit]
summary: Three-layer architecture design for Wingman. Control layer: a Finite State Machine (or Hierarchical SM) driven by winit peripheral events (mouse, keyboard, window, zoom, scroll) — this FSM is also the model the AI uses to understand the user. Display layer: a Scene containing all 2D/3D objects rendered by a Renderer (multi-window capable). Domain layer: domain model with services, repositories, AI models, compilation, filesystem, source code, git, extensions. Integration: Control emits Commands to Domain or Display; Domain and Display emit Events back. Includes concrete workflow traces (mouse click → focus, Ctrl+C → copy, Ctrl+V → paste). UI state taxonomy: Clipboard, Focus, Cursor, Select, Dragged, Hover, Pressed, Editing. Important as the foundational architecture for the Wingman IDE runtime.
---

# Wingman: control/display/domain architecture and FSM

## Three layers

### Control

- The state of the UI is managed through a **Finite State Machine** (or Hierarchical State Machine)
- `winit` and other peripheral drivers trigger state changes to the FSM
- The FSM manages: mouse, keyboard, window, zoom, scroll, and other peripheral state and transitions
- FSM state changes trigger changes to the Scene or Domain
- **This is also the state machine the AI uses to model and understand the human**

### Display

- A **Scene** containing all objects in the 2D/3D visual model space
- A **Renderer** that takes the Scene and paints it on screen efficiently
- Supports multiple displays/windows

### Domain

- **Domain Model** containing all objects in the application's domain space: Services, Repositories, AI models, compilation, filesystem, source code, git, extensions, etc.

## Integration pattern

```
Control  →  Commands  →  Domain / Display
Domain   →  Events    →  Control
Display  →  Events    →  Control
```

## Example workflows

```
MouseInput(Left) → MouseClickHandler
  → queries Scene for Object
  → sets Focus state

Ctrl+C → KeyboardShortcutHandler → CopyEvent → CopyEventHandler
  → if select: copies selected structure to clipboard
  → if focus: copies focused structure to clipboard
  → else: ignores

Ctrl+V → KeyboardShortcutHandler → PasteEvent → PasteEventHandler → PasteCommand
  → takes focus id + clipboard, sends command → PasteCommandHandler
  → updates data structure of target
```

## UI state taxonomy

- **Clipboard** — copied content
- **Focus** — currently focused element
- **Cursor** — text cursor position
- **Select** — selection range
- **Dragged** — element being dragged
- **Hover** — element under cursor
- **Pressed** — element being pressed
- **Editing** — element in edit mode
