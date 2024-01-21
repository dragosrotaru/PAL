# Architecture

## Control
The State of the UI Is handled through a
Finite State Machine or Hierarchical State Machine

This is the State Machine the AI gets to use in order to model and understand the human being.

- winit and other peripheral drivers triggering state changes to the FSM

- a UI FSM managing mouse, keyboard, window, zoom, scroll, etc (peripherals) state and transitions, which trigger changes to the Scene or Domain.

## Display 
- A Scene containing all the objects in the 2d/3d visual model space, which are rendered.

- A Renderer which takes the Scene and paints it on the screen efficiently

- This can handle multiple displays/windows

## Domain

- Domain Model contains all of the Objects in the domain space of the application, including Services, Repositories, etc.

This will include AI models, compilation, filesystem, source code, git, extensions, etc.

## Putting it all together

The Control emits Commands to the Domain or the Display.

The Domain and Display consume Commands and emit Events.

Example Workflow: 

MouseInput(Left) (event) -> MouseClickHandler
    - queries Scene for Object
    - Sets Focus State

Ctrl+C (events) -> KeyboardShortcutHandler -> CopyEvent (internal) -> CopyEventHandler
    - if select, copies selected structure into clipboard
    - if focus, copies focused structure into clipboard
    - else ignores

Ctrl+p (events) -> KeyboardShortcutHandler -> pasteEvent (internal) -> pasteEventHandler -> PasteCommand
    - takes focus id + clipboard and sends command

PasteCommandHandler
    - updates the data structure of the target


Clipboard
Focus
Cursor
Select
Dragged

Hover
Pressed
Editing