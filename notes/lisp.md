# lisp.ts

A Lisp interpreter and REPL (Read-Eval-Print-Loop) in TypeScript, parsing and evaluating an extremely minimal lisp. It is Turing Complete and implemented with Untyped Lambda Calculus.

- Lexically Scoped
- Environment-Passing Interpreter
- Normal Order Evaluation
- Four Primitive Data Types:
  - Identifiers represented by Symbols
  - Strings
  - Lists represented by JS Arrays
  - JS Functions as Procedures
- Nested Array Binary AST
- Multiple Input Lambda Functions.

### References

The design of this interpreter was informed by [William Byrd on "The Most Beautiful Program Ever Written" [PWL NYC]](https://www.youtube.com/watch?v=OyfBQmvr2Hc), which is an incredible talk I recommend to anyone interested in Computer Science. This talk blew my mind - thanks William!

I also referred to [Mary Rose Cook's LittleLisp JS Interpreter](https://github.com/maryrosecook/littlelisp) to better understand the differences between a Meta Circular Evaluator as implemented in William's talk, and an Interpreter written in a different host language.
