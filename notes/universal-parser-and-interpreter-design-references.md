---
date: 2023-08-02
tags: [research, parsers, interpreter, lisp, brain-computer-interface, neurosymbolic]
summary: References for universal parsing and Lisp interpreter design. Covers bblfsh (universal code parser), VSCode language extension API, Rust parser crate index, the William Byrd metacircular evaluator talk that inspired pal-ts's design, and Mary Rose Cook's LittleLisp (showing the difference between metacircular and cross-language interpreters). Also links to neurosymbolic AI research and brain-computer interface hardware (Neurosity Crown).
---

# Universal parser and interpreter design references

## Universal parsers

- [bblfsh](https://github.com/bblfsh) — universal code parser (language-agnostic AST)
- [VSCode Language Extensions Overview](https://code.visualstudio.com/api/language-extensions/overview)
- [lib.rs parser implementations](https://lib.rs/parser-implementations) — Rust parser crate index

## Brain-Computer Interface

- [BCI talk](https://www.youtube.com/watch?v=-HYbFm67Gs8)
- [Neurosity Crown](https://neurosity.co/crown?type=buy) — EEG headset for developers

## NeuroSymbolic

- [NeuroSymbolic AI paper](https://arxiv.org/abs/2204.10532)

## Interpreter design — key references

The design of the pal-ts interpreter was informed by:

- [William Byrd — "The Most Beautiful Program Ever Written" (PWL NYC)](https://www.youtube.com/watch?v=OyfBQmvr2Hc) — metacircular evaluator talk; essential for anyone interested in CS
- [Mary Rose Cook — LittleLisp JS Interpreter](https://github.com/maryrosecook/littlelisp) — shows the difference between a metacircular evaluator and an interpreter written in a different host language
