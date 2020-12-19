# lisp.ts

A Lisp interpreter and REPL (Read-Eval-Print-Loop) in TypeScript, parsing and evaluating an extremely minimal lisp. It is Turing-Complete and implemented with Pure Untyped Lambda Calculus.

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
- Implement a P2P Content-Addressable Interpreter Context with IPFS. See Unison Lang for inspiration.
- Implement a strict module system derived from unix filesystem structure. 
- Implement Church Encodings.
- Implement a Type System.
- Use JS Symbols instead of strings for Identifiers.
- Go more esoteric - Implement `Iota and Jot`, `SK combinator calculus`
- Implement a Music Set Theory Language.
- 
- Add `define` special form
- Add `quote` special form
- Add N-ary lambda suppor
### References

The design of this interpreter was informed by [William Byrd on "The Most Beautiful Program Ever Written" [PWL NYC]](https://www.youtube.com/watch?v=OyfBQmvr2Hc), which is an incredible talk I recommend to anyone interested in Computer Science. This talk blew my mind - thanks William!

I also referred to [Mary Rose Cook's LittleLisp JS Interpreter](https://github.com/maryrosecook/littlelisp) to better understand the differences between a Meta Circular Evaluator as implemented in William's talk, and an Interpreter written in a different host language.