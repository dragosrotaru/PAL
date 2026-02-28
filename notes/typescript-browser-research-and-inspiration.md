---
date: 2024-01-21
tags: [typescript, browser, research, structured-clone, monaco, observable, reference]
summary: Research notes on running TypeScript in the browser — structured clone limitations for postMessage, TypeScript compiler API links, and inspiration from ObservableHQ, Glitch, and Bit.dev.
---

# TypeScript in the browser — research and inspiration

## Structured clone algorithm

Used internally by `postMessage()` and `IndexedDB`. Limitations:

- `Error` and `Function` objects cannot be cloned — throws `DATA_CLONE_ERR`
- DOM nodes cannot be cloned
- Property descriptors, setters, getters, and prototype chain are not preserved
- Read-only properties become read-write in the clone

Supported types: all primitives (except Symbol), Boolean, String, Date, RegExp, Blob, File, FileList, ArrayBuffer, ArrayBufferView (typed arrays), ImageData, Array, plain Object, Map, Set.

## TypeScript compiler API

- https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#a-minimal-compiler
- https://github.com/peterholak/ts-play
- https://github.com/fabiandev/typescript-playground
- https://github.com/microsoft/TypeScript-Website/tree/v2/packages/playground
- https://github.com/cancerberoSgx/typescript-in-the-browser
- https://github.com/Microsoft/monaco-editor-samples/

## Inspiration

- [ObservableHQ](https://observablehq.com/product) — each cell is a unit with a source code editor and a rendered display side. Independent evaluation, reactive updates.
- [Glitch](https://glitch.com/) — collaborative in-browser code editing with live preview
- [Bit.dev](https://bit.dev/) — component registry and sharing platform
