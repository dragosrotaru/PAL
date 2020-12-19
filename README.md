# lisp.ts

A Lisp interpreter and REPL (Read-Eval-Print-Loop) in TypeScript, parsing and evaluating an extremely minimal lisp. It is Turing Complete and implemented with Untyped Lambda Calculus.

- Only one special form - `( lambda ( argument ) body )`
- Lexically Scoped
- Environment-Passing Interpreter
- Normal Order Evaluation
- Two Primitive Data Types:
  - Identifiers represented by JS strings
  - Lists represented by JS Arrays
- Nested Array Binary AST
- Single Input Lambda Functions only.
- Console logging for every step.
- A single pre-set environment variable: `a = "hello world"`

### Where to go from here?

- Implement in other languages - `Lisp`, `Haskell`, `C`, `WebAssembly`, `Rust`.
- Implement the original `evalquote` Meta-Circular Evaluator from John McCarthy's `The Lisp 1.5 Manual`.
- Implement a P2P "Content-Addressable Expressions" network protocol for the Interpreter. See Unison Lang for inspiration.
- Implement a namespace system derived from unix filesystem structure.
- Implement Church Encodings.
- Implement a Type System.
- Use JS Symbols instead of strings for Identifiers.
- Go more esoteric - Implement `Iota and Jot`, `SK combinator calculus` or a pure `lambda calculus` syntax.
- Implement DSL, i.e. for Musical Set Theory.
- Add other classic features like `define` or `quote` special forms, functions with n-ary inputs, lazy evaluation, continuation passing style, dynamic scope, etc.

### References

The design of this interpreter was informed by [William Byrd on "The Most Beautiful Program Ever Written" [PWL NYC]](https://www.youtube.com/watch?v=OyfBQmvr2Hc), which is an incredible talk I recommend to anyone interested in Computer Science. This talk blew my mind - thanks William!

I also referred to [Mary Rose Cook's LittleLisp JS Interpreter](https://github.com/maryrosecook/littlelisp) to better understand the differences between a Meta Circular Evaluator as implemented in William's talk, and an Interpreter written in a different host language.