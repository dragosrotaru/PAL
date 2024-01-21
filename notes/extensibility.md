# Extensibility

## Extensions

You can think of Extensions as something in between a Macro and a Primitive. Each Extension is its own language. It implements a Parser and Writer, a unique FileExtension, and Representations in different Mediums. Mediums include the FileSystem and the GUI.

Extensions implement TypeClasses (Traits in Rust), which enable the composability and interactability of different Extensions.

## Plugins

Plugins add orthogonal feature sets to Pal. more on this later.