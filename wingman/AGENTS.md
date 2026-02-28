# AGENTS.md — wingman (Prophet)

> AI-audience orientation guide for the `wingman` / Prophet WebGPU application.
> @author claude

## What this is

A WebGPU-based text editor / IDE runtime. Named "Prophet" in the codebase (README title).
Built with `wgpu` (WebGPU) + `winit` (cross-platform windowing). Targets both native desktop
and WebAssembly (via `wasm-pack`).

## Architecture

```
lib.rs::run()
  ├── display::render::RenderService  (wgpu surface, pipeline, text rendering)
  ├── control::keyboard::KeyboardService  (keybinding dispatch)
  └── domain::ast  (editor document model — stub)
```

### Modules

| Module                  | Purpose                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| `display/render.rs`     | wgpu device/surface/pipeline setup; `render()` and `update()`                                    |
| `display/text.rs`       | Text rendering                                                                                   |
| `display/pipeline.rs`   | Render pipeline configuration                                                                    |
| `display/picking.rs`    | Click/cursor hit testing                                                                         |
| `display/geometry/`     | Geometric primitives: point, line, rectangle, circle, triangle, prism, sphere, vertex, dimension |
| `display/components.rs` | UI component abstractions for the display layer                                                  |
| `control/keyboard.rs`   | Key action registry: maps VirtualKeyCode+ModifiersState → closures                               |
| `control/mouse.rs`      | Mouse event handling                                                                             |
| `domain/ast.rs`         | Editor document AST (empty stub)                                                                 |

## Entry Points

| Task                | File                                                     |
| ------------------- | -------------------------------------------------------- |
| Application startup | `src/lib.rs::run()`                                      |
| Render loop         | `src/display/render.rs`                                  |
| Keyboard shortcuts  | `src/lib.rs` — `keyboard_service.set_key_action()` calls |
| WGSL shader         | `src/display/render.wgsl`                                |

## Build

```bash
# Native desktop
cargo run -p wingman

# WebAssembly
wasm-pack build wingman --target web
npx http-server  # serve index.html
```

## Missing Pieces

- `domain/ast.rs` is empty — no document model.
- Hard-coded fibonacci text in `run()` instead of a real text buffer.
- KeyboardService is set up but the keyboard handler in the event loop uses it via `handle_keyboard_input()` — copy/paste/cut print "Copy"/"Paste"/"Cut" but do nothing.
- Mouse events (CursorMoved, MouseInput, MouseWheel) are only logged, not handled.
- No text editing (insert/delete characters).
- No file open/save.
- Scale factor and theme changes are logged but not handled.
- Window close doesn't do cleanup (noted with todo).
- Touchpad magnify (zoom gesture) is not implemented.

## Gotchas

- `wasm32` target requires `cfg_if`, `wasm-bindgen`, `console_error_panic_hook`, `console_log`.
- Native target requires env_logger for logging initialization.
