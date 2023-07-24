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

## TODO

- add type annotation to all the import statements

- (view /countries)

  - show the following in the browser:
    /countries
    norway ...
  - be able to:
    - mutate
      - delete elements of the list
      - delete list and symbol
      - change list symbol
    - view
      - meta-info
        - permanence: file, cached, in-memory
        - createdAt
        - modifiedAt
        - other file metadata
      - filter
        - textual
      - sort
        - lexographical order ascending/descending
        - length ascending/descending

The UI is on the web. The query to view an object can be triggered from the command line first.
The UI is made of react. the interpreter and data live on the server-side, locally. The UI makes changes to the state of the system and queries its state. As such, the UI should listen to changes continuously via websocket.

what portion of state is necessary for the UI to be aware of? lets start with an object that is opened.

(view /countries)

- the type of /countries is determined: List
- the same way the evaluator matches to the pattern of the expression, the view command matches to the expression, and it loads the view from the namespace.

- implement loading hyper modules
- implement loading native typescript modules
-

- implement parser that allows spaces in strings
- process entire file structure in compiler

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
- Add other classic features like `quote` special forms, functions with n-ary inputs, lazy evaluation, continuation passing style, dynamic scope, etc.

### References

The design of this interpreter was informed by [William Byrd on "The Most Beautiful Program Ever Written" [PWL NYC]](https://www.youtube.com/watch?v=OyfBQmvr2Hc), which is an incredible talk I recommend to anyone interested in Computer Science. This talk blew my mind - thanks William!

I also referred to [Mary Rose Cook's LittleLisp JS Interpreter](https://github.com/maryrosecook/littlelisp) to better understand the differences between a Meta Circular Evaluator as implemented in William's talk, and an Interpreter written in a different host language.
