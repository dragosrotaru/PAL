# Editor

I need a virtual filesystem / module resolver which serves the language server, standalone compiler and bundler

- editing in VSCode - Language Server
- building - compiling and bundling
- editing in Notion2.0 - Language Server
- building - compiling and bundling

The magic bits
- live loading code
- editing the ast

Creating a component that edits the AST is almost impossible

A new strategy: create a TS REPL environment where you can interact with your data models.
THe code editing is still useful. 
We make all of our data code be serializable
There is one bit that still needs a solution: JSON symbols (pointers/references)